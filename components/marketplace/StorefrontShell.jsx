'use client';

import { useMemo, useState } from 'react';
import { Heart, Search, ShoppingBag, Star, Plus, Minus, Trash2, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { storefrontCategories, storefrontProducts, formatPrice } from '../../lib/storefrontData';

function ProductCard({ product, liked, onLike, onAdd }) {
  return (
    <article className="market-product-card">
      <div className="market-product-image-wrap">
        <img src={product.image} alt={product.name} className="market-product-image" />
        {product.badge && <span className="market-badge">{product.badge}</span>}
        <button type="button" className={`market-like ${liked ? 'is-liked' : ''}`} onClick={() => onLike(product.id)} aria-label={liked ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} للمفضلة`}>
          <Heart fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="market-product-content">
        <p className="market-eyebrow">{product.categoryName} · {product.seller}</p>
        <h3>{product.name}</h3>
        <div className="market-rating"><Star fill="currentColor" /> <strong>{product.rating}</strong> <span>({product.reviews})</span></div>
        <div className="market-price-row"><div><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><button type="button" className="market-add" onClick={() => onAdd(product)} aria-label={`أضف ${product.name} إلى السلة`}><Plus /></button></div>
      </div>
    </article>
  );
}

export default function StorefrontShell() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const visibleProducts = useMemo(() => storefrontProducts.filter((product) => (activeCategory === 'all' || product.category === activeCategory) && product.name.includes(search)), [activeCategory, search]);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const addToCart = (product) => setCart((items) => items.some((item) => item.id === product.id) ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]);
  const updateQuantity = (id, delta) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity));

  return <main className="marketplace" dir="rtl">
    <section className="market-hero">
      <div className="market-hero-copy"><span className="market-kicker"><Sparkles /> سوقك المحلي، بطابعك</span><h1>اختيارات جميلة<br /><em>تصل إلى بابك.</em></h1><p>اكتشف منتجات منتقاة من البائعين المحليين، واشترِ بثقة وبطريقة أسهل.</p><div className="market-hero-actions"><a href="#products" className="market-primary-button">تسوق الآن <ArrowLeft /></a><span><strong>+2,400</strong> منتج محلي</span></div></div>
      <div className="market-hero-art"><div className="market-orb" /><img src="/images/image (9).jpg" alt="منتجات مختارة من السوق" /><div className="market-floating-note"><span>توصيل موثوق</span><strong>إلى كل المحافظات</strong></div></div>
    </section>
    <section className="market-section market-category-section"><div className="market-section-heading"><div><span className="market-kicker">استكشف مجموعاتنا</span><h2>ما الذي تبحث عنه اليوم؟</h2></div><button type="button" className="market-text-button" onClick={() => setActiveCategory('all')}>عرض الكل <ArrowLeft /></button></div><div className="market-categories"><button type="button" className={`market-category all ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}><span>✦</span><strong>كل المنتجات</strong></button>{storefrontCategories.map((category) => <button type="button" key={category.id} className={`market-category ${category.tone} ${activeCategory === category.id ? 'active' : ''}`} onClick={() => setActiveCategory(category.id)}><span>{category.icon}</span><strong>{category.name}</strong></button>)}</div></section>
    <section className="market-section" id="products"><div className="market-section-heading"><div><span className="market-kicker">منتجات تستحق التجربة</span><h2>{activeCategory === 'all' ? 'الأكثر رواجاً هذا الأسبوع' : storefrontCategories.find((category) => category.id === activeCategory)?.name}</h2></div><label className="market-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن منتج..." aria-label="البحث عن منتج" /></label></div><div className="market-product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} liked={liked.includes(product.id)} onLike={(id) => setLiked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])} onAdd={addToCart} />)}</div></section>
    <section className="market-trust"><div><span>01</span><strong>دفع آمن</strong><p>خيارات دفع واضحة وموثوقة.</p></div><div><span>02</span><strong>بائعون موثوقون</strong><p>نراجع الجودة ونستمع لتجربتك.</p></div><div><span>03</span><strong>تجربة بسيطة</strong><p>من الاكتشاف حتى الاستلام.</p></div></section>
    <button type="button" className="market-cart-button" onClick={() => setCheckoutOpen(true)} aria-label="فتح سلة المشتريات"><ShoppingBag /><span>السلة {cartCount > 0 && <b>{cartCount}</b>}</span></button>
    {checkoutOpen && <div className="market-modal-backdrop" role="presentation" onClick={() => setCheckoutOpen(false)}><aside className="market-cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}><div className="market-cart-header"><div><span className="market-kicker">مراجعة الطلب</span><h2 id="cart-title">سلة مشترياتك</h2></div><button type="button" onClick={() => setCheckoutOpen(false)} aria-label="إغلاق السلة">×</button></div>{orderPlaced ? <div className="market-success"><Check /><h3>تم تأكيد طلبك</h3><p>شكراً لثقتك. سنرسل لك تفاصيل التوصيل قريباً.</p><button type="button" className="market-primary-button" onClick={() => { setCart([]); setOrderPlaced(false); setCheckoutOpen(false); }}>متابعة التسوق</button></div> : cart.length === 0 ? <div className="market-empty"><ShoppingBag /><h3>السلة فارغة حالياً</h3><p>أضف المنتجات التي أعجبتك لتظهر هنا.</p></div> : <><div className="market-cart-items">{cart.map((item) => <div className="market-cart-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.name}</strong><span>{formatPrice(item.price)}</span><div className="market-qty"><button type="button" onClick={() => updateQuantity(item.id, -1)}><Minus /></button><b>{item.quantity}</b><button type="button" onClick={() => updateQuantity(item.id, 1)}><Plus /></button></div></div><button type="button" className="market-remove" onClick={() => setCart((items) => items.filter((cartItem) => cartItem.id !== item.id))} aria-label={`حذف ${item.name}`}><Trash2 /></button></div>)}</div><div className="market-cart-total"><span>الإجمالي</span><strong>{formatPrice(cartTotal)}</strong></div><button type="button" className="market-primary-button market-checkout" onClick={() => setOrderPlaced(true)}>إتمام الشراء <ArrowLeft /></button><small>هذا عرض تجريبي ببيانات وهمية، ولا يتم تحصيل أي مبلغ.</small></>}</aside></div>}
  </main>;
}
