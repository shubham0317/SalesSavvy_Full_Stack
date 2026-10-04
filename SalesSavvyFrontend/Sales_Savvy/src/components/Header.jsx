import CartIcon from "./CartIcon";
import ProfileDropdown from "./ProfileDropdown";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header({ cartCount: propCartCount, username: propUsername }) {
  const { cartCount: contextCartCount } = useCart();
  const { username: contextUsername } = useAuth();

  const count = propCartCount !== undefined ? propCartCount : contextCartCount;
  const username = propUsername || contextUsername;

  return (
    <header className="header">
      <div className="header-content">
        <Logo />

        <div className="header-actions">
          <CartIcon count={count} />
          <ProfileDropdown username={username} />
        </div>
      </div>
    </header>
  );
}

export default Header;