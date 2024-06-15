import { useState, useContext, createContext, useEffect } from "react";

const WishlistContext = createContext();
const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let existingWishlistItem = localStorage.getItem("wishlist");
    if (existingWishlistItem) setWishlist(JSON.parse(localStorage.getItem("wishlist")));
    else {
      setWishlist([])
    }
  }, []);

  return (
    <WishlistContext.Provider value={[wishlist, setWishlist]}>
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };