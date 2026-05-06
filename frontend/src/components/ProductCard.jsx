import { FiShoppingCart } from "react-icons/fi";

function ProductCard({ product, deal, onAddToCart }) {
  const hasDeal = Boolean(deal);

  const price = Number(product.price || 0);
  const discount = hasDeal ? Number(deal.discount_percentage || 0) : 0;
  const finalPrice = hasDeal ? price - (price * discount) / 100 : price;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="no-img">No Image</div>
        )}

        {hasDeal && <span className="deal-badge">{discount}% OFF</span>}
      </div>

      <div className="product-body">
        <div className="product-top">
          <span className="category-pill">{product.category}</span>
          <span
            className={
              product.is_available ? "success-badge" : "danger-badge"
            }
          >
            {product.stock_status}
          </span>
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="price-row">
          {hasDeal ? (
            <>
              <span className="old-price">₹{price.toFixed(2)}</span>
              <span className="price">₹{finalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="price">₹{price.toFixed(2)}</span>
          )}
        </div>

        <button
          className="primary-btn add-cart-btn"
          disabled={!product.is_available}
          onClick={() => onAddToCart(product.id)}
        >
          <FiShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;