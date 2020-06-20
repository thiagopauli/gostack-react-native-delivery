import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
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
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const { navigate } = useNavigation();

  const [favorites, setFavorites] = useState<Food[]>([]);

  async function handleNavigate(id: number): Promise<void> {
    navigate('FoodDetails', { id });
  }

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const { status, data } = await api.get('favorites');
      if (status === 200) {
        const favs = data.map((food: Omit<Food, 'formattedPrice'>) => {
          if (food.price) {
            return { ...food, formattedPrice: formatValue(food.price) };
          }
          return food;
        });
        setFavorites(favs);
      }
    }

    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food activeOpacity={0.6} onPress={() => handleNavigate(item.id)}>
              <FoodImageContainer>
                <Image style={{ width: 88, height: 88 }} source={{ uri: item.thumbnail_url }} />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
