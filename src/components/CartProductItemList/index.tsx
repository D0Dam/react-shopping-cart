/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';
import CartProductItem from '../CartProductItem';
import useGetQuery from '../../hooks/useGetQuery';
import { $CartIdList, $CartItemState, $CheckedCartIdList, $ToastStateList } from '../../recoil/atom';
import styles from './index.module.scss';
import type { CartItem } from '../../types';
import useMutationQuery from '../../hooks/useMutationQuery';

function CartProductItemList() {
  const { data: cartProductsData, error, refreshQuery } = useGetQuery<CartItem[]>('./cart-items');
  const { mutateQuery } = useMutationQuery<Record<string, number>, CartItem>('./cart-items');
  const [checkedCartIdList, setCheckedCartIdList] = useRecoilState($CheckedCartIdList);
  const [cartIdList, setCartIdList] = useRecoilState($CartIdList);
  const setToastStateList = useSetRecoilState($ToastStateList);

  useEffect(() => {
    if (error) {
      setToastStateList(prev => [
        ...prev,
        { type: 'error', message: '장바구니를 불러오는 과정에서 문제가 생겼습니다.' },
      ]);
    }
  }, [error]);

  const checkAllCartItem: React.ChangeEventHandler<HTMLInputElement> = ({ target: { checked } }) => {
    if (checked && cartProductsData) {
      return setCheckedCartIdList(cartProductsData.map(({ product }) => product.id));
    }
    return setCheckedCartIdList([]);
  };

  const checkCartItem =
    (id: number) =>
    ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
      if (!checked) {
        return setCheckedCartIdList(prev => prev.filter(cartId => cartId !== id));
      }
      return setCheckedCartIdList(prev => [...prev, id]);
    };

  const deleteCheckedCartItem = useRecoilCallback(({ set }) => () => {
    checkedCartIdList.forEach(async id => {
      await mutateQuery('DELETE', undefined, String(id));
      set($CartItemState(id), null);
      setCartIdList(prev => prev.filter(cartId => cartId !== id));
    });

    refreshQuery();
    setCheckedCartIdList([]);

    if (!error) {
      setToastStateList(prev => [...prev, { type: 'success', message: '장바구니가 전부 삭제되었습니다.' }]);
    }
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>배송 상품 {`(${cartIdList.length}개)`}</h3>
      <section className={styles['cart-container']}>
        {cartProductsData?.map((item: CartItem) => (
          <CartProductItem
            key={item.id}
            cartItem={item}
            refresh={refreshQuery}
            toggleCheck={checkCartItem(item.product.id)}
            checked={checkedCartIdList.includes(item.product.id)}
          />
        ))}
      </section>
      <div className={styles['check-menu']}>
        <input
          type="checkbox"
          className={styles['check-box']}
          onChange={checkAllCartItem}
          checked={cartIdList.length === checkedCartIdList.length}
        />
        <div>전체 선택 ({`${checkedCartIdList.length}/${cartIdList.length}`})</div>
        <button onClick={deleteCheckedCartItem}>선택 삭제</button>
      </div>
    </div>
  );
}

export default CartProductItemList;
