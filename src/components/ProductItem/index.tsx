import AddCartButton from '../AddCartButton';
import styles from './index.module.css';
import type { Product } from './types';

interface ProductItemProps {
  product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const { name, imageUrl, price } = product;
  return (
    <div className={styles.container}>
      <img src={imageUrl} alt={name} className={styles.image} />
      <div className={styles['item-info']}>
        <div>
          <div>{name}</div>
          <AddCartButton />
        </div>
        <div>{price.toLocaleString()} 원</div>
      </div>
    </div>
  );
};

export default ProductItem;
