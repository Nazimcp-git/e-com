/* LUXE — Product Seed Data with Real Images */

const PRODUCTS = [
  {
    id: 'p1', title: 'Classic Leather Jacket', description: 'Premium hand-stitched leather jacket with quilted lining. Perfect for any occasion.',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&h=800&fit=crop'],
    price: 8999, discountPrice: 5999, sizes: ['S','M','L','XL'], stock: 12, category: 'men',
    tags: ['trending','winter'], rating: 4.5, reviews: 128
  },
  {
    id: 'p2', title: 'Silk Floral Dress', description: 'Elegant floral print silk dress with flowing silhouette.',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'],
    price: 5499, discountPrice: 3799, sizes: ['XS','S','M','L'], stock: 8, category: 'women',
    tags: ['trending','summer'], rating: 4.7, reviews: 95
  },
  {
    id: 'p3', title: 'Slim Fit Chinos', description: 'Comfortable stretch cotton chinos with modern slim fit.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop'],
    price: 2499, discountPrice: 1799, sizes: ['S','M','L','XL','XXL'], stock: 25, category: 'men',
    tags: ['casual'], rating: 4.3, reviews: 210
  },
  {
    id: 'p4', title: 'Oversized Hoodie', description: 'Ultra-soft fleece hoodie with kangaroo pocket. Unisex fit.',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop'],
    price: 2999, discountPrice: 1999, sizes: ['M','L','XL'], stock: 30, category: 'men',
    tags: ['trending','winter','new'], rating: 4.6, reviews: 178
  },
  {
    id: 'p5', title: 'Embroidered Kurta Set', description: 'Hand-embroidered cotton kurta with matching pants.',
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop'],
    price: 3999, discountPrice: 2799, sizes: ['S','M','L','XL'], stock: 15, category: 'women',
    tags: ['ethnic','new'], rating: 4.8, reviews: 64
  },
  {
    id: 'p6', title: 'Running Sneakers', description: 'Lightweight mesh sneakers with cushioned sole. Breathable.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop','https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=800&fit=crop'],
    price: 4499, discountPrice: 2999, sizes: ['7','8','9','10','11'], stock: 20, category: 'accessories',
    tags: ['trending','sports'], rating: 4.4, reviews: 312
  },
  {
    id: 'p7', title: 'Kids Denim Jacket', description: 'Stylish denim jacket for kids with snap buttons.',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop'],
    price: 1999, discountPrice: 1299, sizes: ['4Y','6Y','8Y','10Y'], stock: 18, category: 'kids',
    tags: ['casual'], rating: 4.2, reviews: 45
  },
  {
    id: 'p8', title: 'Cashmere Scarf', description: 'Luxuriously soft 100% cashmere scarf. Perfect gift.',
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop'],
    price: 3499, discountPrice: 2499, sizes: ['One Size'], stock: 10, category: 'accessories',
    tags: ['winter','luxury'], rating: 4.9, reviews: 87
  },
  {
    id: 'p9', title: 'Striped Polo T-Shirt', description: 'Classic striped polo in premium cotton piqué.',
    images: ['https://images.unsplash.com/photo-1625910513413-5fc08ef42808?w=600&h=800&fit=crop'],
    price: 1499, discountPrice: 999, sizes: ['S','M','L','XL'], stock: 40, category: 'men',
    tags: ['casual','summer'], rating: 4.1, reviews: 156
  },
  {
    id: 'p10', title: 'Maxi Skirt', description: 'Flowing maxi skirt with bohemian print. Elastic waist.',
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0edd0?w=600&h=800&fit=crop'],
    price: 2299, discountPrice: 1599, sizes: ['XS','S','M','L'], stock: 14, category: 'women',
    tags: ['summer','boho'], rating: 4.3, reviews: 72
  },
  {
    id: 'p11', title: 'Formal Blazer', description: 'Tailored single-breasted blazer in Italian wool blend.',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop'],
    price: 7999, discountPrice: 5499, sizes: ['S','M','L','XL'], stock: 7, category: 'men',
    tags: ['formal','luxury'], rating: 4.7, reviews: 93
  },
  {
    id: 'p12', title: 'Kids Rainbow T-Shirt', description: 'Fun rainbow print organic cotton tee for kids.',
    images: ['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop'],
    price: 799, discountPrice: 549, sizes: ['2Y','4Y','6Y','8Y'], stock: 50, category: 'kids',
    tags: ['casual','new'], rating: 4.0, reviews: 38
  },
  {
    id: 'p13', title: 'Leather Crossbody Bag', description: 'Compact genuine leather crossbody with gold hardware.',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop'],
    price: 4999, discountPrice: 3499, sizes: ['One Size'], stock: 11, category: 'accessories',
    tags: ['trending','luxury'], rating: 4.6, reviews: 142
  },
  {
    id: 'p14', title: 'Wrap Dress', description: 'Flattering wrap dress in georgette fabric with tie waist.',
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop'],
    price: 3299, discountPrice: 2299, sizes: ['XS','S','M','L','XL'], stock: 16, category: 'women',
    tags: ['office','new'], rating: 4.5, reviews: 108
  },
  {
    id: 'p15', title: 'Cargo Joggers', description: 'Relaxed cargo joggers with multiple pockets. Drawstring waist.',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=800&fit=crop'],
    price: 1999, discountPrice: 1399, sizes: ['S','M','L','XL'], stock: 22, category: 'men',
    tags: ['streetwear','casual'], rating: 4.2, reviews: 189
  },
  {
    id: 'p16', title: 'Aviator Sunglasses', description: 'Polarized aviator sunglasses with gold metal frame.',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop'],
    price: 2999, discountPrice: 1999, sizes: ['One Size'], stock: 35, category: 'accessories',
    tags: ['trending','summer'], rating: 4.4, reviews: 256
  },
  {
    id: 'p17', title: 'Kids Party Dress', description: 'Sequined party dress with tulle skirt for girls.',
    images: ['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop'],
    price: 2499, discountPrice: 1799, sizes: ['4Y','6Y','8Y','10Y'], stock: 9, category: 'kids',
    tags: ['party','new'], rating: 4.6, reviews: 52
  },
  {
    id: 'p18', title: 'Linen Shirt', description: 'Breathable pure linen shirt. Perfect for summer.',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop'],
    price: 2499, discountPrice: 1699, sizes: ['S','M','L','XL'], stock: 28, category: 'men',
    tags: ['summer','casual'], rating: 4.3, reviews: 134
  },
  {
    id: 'p19', title: 'Ankle Boots', description: 'Suede ankle boots with block heel and side zip.',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop'],
    price: 5999, discountPrice: 3999, sizes: ['5','6','7','8','9'], stock: 6, category: 'women',
    tags: ['winter','trending'], rating: 4.8, reviews: 76
  },
  {
    id: 'p20', title: 'Graphic Tee Collection', description: 'Limited edition artist collaboration graphic tees.',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop'],
    price: 1299, discountPrice: 899, sizes: ['S','M','L','XL','XXL'], stock: 45, category: 'men',
    tags: ['streetwear','new','trending'], rating: 4.1, reviews: 223
  }
];

const CATEGORIES = [
  { id: 'men', name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&h=667&fit=crop', count: 8 },
  { id: 'women', name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=667&fit=crop', count: 5 },
  { id: 'kids', name: 'Kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&h=667&fit=crop', count: 3 },
  { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=667&fit=crop', count: 4 }
];

const HERO_SLIDES = [
  { tag: 'New Collection', title: 'Summer\nEssentials', desc: 'Discover the hottest trends for the season. Up to 50% off on select styles.', cta: 'Shop Now', link: '/products', bg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=900&fit=crop' },
  { tag: 'Limited Edition', title: 'Luxury\nRedefined', desc: 'Premium fabrics. Timeless designs. Crafted for the modern wardrobe.', cta: 'Explore', link: '/products', bg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop' },
  { tag: 'Flash Sale', title: 'Flat 40%\nOff Today', desc: 'Don\'t miss our biggest sale of the year. Ends at midnight!', cta: 'Grab Deals', link: '/products', bg: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=900&fit=crop' }
];

export { PRODUCTS, CATEGORIES, HERO_SLIDES };
