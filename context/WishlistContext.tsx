import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface WishlistContextType {
  wishlistItems: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  wishlistCount: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Guest wishlist stored in localStorage
  const [guestWishlist, setGuestWishlist] = useLocalStorage<string[]>('marjahans_wishlist', []);

  // Fetch wishlist from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      // Use guest wishlist from localStorage
      setWishlistItems(guestWishlist);
    }
  }, [user, guestWishlist]);

  const fetchWishlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching wishlist:', error);
      } else {
        setWishlistItems(data?.map((item) => item.product_id) || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = useCallback(
    async (productId: string) => {
      if (user) {
        // Save to Supabase for authenticated users
        try {
          const { error } = await supabase
            .from('wishlists')
            .insert({ user_id: user.id, product_id: productId });

          if (error) {
            if (error.code !== '23505') {
              // Ignore duplicate key error
              console.error('Error adding to wishlist:', error);
              return;
            }
          }
          setWishlistItems((prev) => [...prev, productId]);
        } catch (err) {
          console.error('Unexpected error adding to wishlist:', err);
        }
      } else {
        // Save to localStorage for guests
        const newWishlist = [...guestWishlist, productId];
        setGuestWishlist(newWishlist);
        setWishlistItems(newWishlist);
      }
    },
    [user, guestWishlist, setGuestWishlist],
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (user) {
        // Remove from Supabase for authenticated users
        try {
          const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) {
            console.error('Error removing from wishlist:', error);
            return;
          }
          setWishlistItems((prev) => prev.filter((id) => id !== productId));
        } catch (err) {
          console.error('Unexpected error removing from wishlist:', err);
        }
      } else {
        // Remove from localStorage for guests
        const newWishlist = guestWishlist.filter((id) => id !== productId);
        setGuestWishlist(newWishlist);
        setWishlistItems(newWishlist);
      }
    },
    [user, guestWishlist, setGuestWishlist],
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.includes(productId);
    },
    [wishlistItems],
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(productId);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist],
  );

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = useMemo(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount,
      loading,
    }),
    [
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount,
      loading,
    ],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
