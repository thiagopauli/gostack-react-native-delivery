import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedValue: string;
  thumbnail_url: string;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface ApiResponseData {
  category: number;
  description: string;
  extras: Extra[];
  id: number;
  name: string;
  price: number;
  product_id: number;
  thumbnail_url: string;
}

interface ApiResponse {
  status: number;
  data: ApiResponseData[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const { status, data }: ApiResponse = await api.get('orders');
      if (status === 200) {
        const newOrders = data.map(order => {
          const totalExtras = order.extras.reduce((total, extra) => {
            return total + +extra.value * +extra.quantity;
          }, 0);
          const formattedValue = formatValue(+totalExtras + +order.price);
          return { ...order, formattedValue };
        });
        setOrders(newOrders);
      }
    }

    loadOrders();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image style={{ width: 88, height: 88 }} source={{ uri: item.thumbnail_url }} />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedValue}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
