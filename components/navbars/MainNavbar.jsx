'use client';
import { Heart, ShoppingBag, UserRound } from 'lucide-react';

export default function MainNavbar() {
  return (
    <header className="market-nav">
      <div className="market-nav-inner">
        <a href="/" className="market-brand" aria-label="أكار الرئيسية"><span>أ</span><strong>أكار</strong></a>
        <nav className="market-nav-links" aria-label="التنقل الرئيسي"><a href="#products">اكتشف</a><a href="#categories">التصنيفات</a><a href="/favorite">المفضلة</a></nav>
        <div className="market-nav-actions"><button type="button" aria-label="المفضلة"><Heart /></button><button type="button" aria-label="الحساب"><UserRound /></button><button type="button" className="market-nav-cart" aria-label="السلة"><ShoppingBag /></button></div>
      </div>
    </header>
  );
}
