import { ActivityIndicator, Image, RefreshControl } from 'react-native';
import styled from 'styled-components/native'
import { useEffect, useRef, useState } from 'react';

//Styled components
const Input = styled.TextInput`
  width: 100%;
  border-radius: 4px;
  border-width: 1px;
  border-color: #DDDDDD;
  paddingHorizontal: 16px;
  paddingVertical: 12px;
  backgroundColor: #FFF;
  font-family: OpenSans_400Regular;
`

const Small = styled.Text`
  font-size: 12px;
  color: #222;
  font-family: OpenSans_600SemiBold;
  margin-bottom: 4px;
`

const Header = styled.View`
  background-color: #F8F8F8;
  padding: 16px;
  gap: 16px;
`

const FlexView = styled.View`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
`

const UnalignedFlexView = styled.View`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: baseline;
`

const FullSizeView = styled.View`
  flex: 1;
`

const PrimaryButton = styled.TouchableOpacity`
  background-color: #F6C224;
  align-items: center;
  paddingVertical: 14px;
  border-radius: 4px;
`

const ButtonText = styled.Text`
  color: #222;
  font-family: OpenSans_600SemiBold;
  font-size: 16px;
`

const Logo = styled.View`
  background-color: #38344E;
  flexDirection: row;
  justifyContent: center;
  paddingVertical: 12px;
  borderRadius: 0 0 16px 16px;
`

const Game = styled.View`
  paddingHorizontal: 16px;
  paddingVertical: 8px;
  gap: 8px;
  borderBottomWidth: 1px;
  borderBottomColor: #F8F8F8;
`

const GameTitle = styled.Text`
  font-family: OpenSans_600SemiBold;
  font-size: 14px;
`

const SpaceBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const MetaCritic = styled.View`
  height: 36px;
  width: 36px;
  borderRadius: 8px;
  justifyContent: center;
  alignItems: center;
`

const BadgeLabel = styled.Text`
  color: #FFF;
  font-family: OpenSans_600SemiBold;
  font-size: 12px;
`

const NormalPrice = styled.Text`
  color: #525252;
  textDecorationLine: line-through;
  font-size: 12px;
  font-family: OpenSans_400Regular;
`

const SalePrice = styled.Text`
  color: #222;
  font-size: 16px;  
  font-family: OpenSans_700Bold;
`

const FlexGrowView = styled.View`
  flex-grow: 0;
`

const List = styled.FlatList`
  flex-grow: 0;
`

const Logo1 = styled.Image`
  width: 52px;
  height: 48px;
`

const Logo2 = styled.Image`
  width: 156px;
  height: 48px;
`

const Thumb = styled.Image`
  width: 120px;
  height: 45px;
`

export function Search() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [pageState, setPageState] = useState(0);
  const listRef = useRef();

  //Search filters
  const [title, setTitle] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  //Async API fetch function
  async function fetchGames(page = 0) {
    const res = await fetch(
      `https://www.cheapshark.com/api/1.0/deals?storeID=1
      ${title && `&title=${title}`}
      ${minPrice && `&lowerPrice=${minPrice}`}
      ${maxPrice && `&upperPrice=${maxPrice}`}
      &pageNumber=${page}`
    )
    const data = await res.json();
    if (page > 0) {
      setList([...list, ...data]);
      setPageState(page);
    }
    else {
      setPageState(page);
      setList(data);
    }
  }

  //Set loading while fetching the API function
  function searchGames(page = 0) {
    setLoading(true);
    fetchGames(page);
    setLoading(false);
  }

  //Fetch games on component mount
  useEffect(() => {
    searchGames();
  }, []);

  return (
    <FullSizeView>
      <FlexGrowView>
        <Logo>
          <Logo1 source={{ uri: "https://www.cheapshark.com/img/logo_image.png?v=1.0" }} />
          <Logo2 source={{ uri: "https://www.cheapshark.com/img/logo_text.png?v=1.0" }} />
        </Logo>
        <Header>
          <Input value={title} onChangeText={setTitle} placeholder="Buscar por título" />
          <FlexView>
            <FullSizeView>
              <Small>MENOR PREÇO:</Small>
              <Input value={minPrice} onChangeText={setMinPrice} />
            </FullSizeView>
            <FullSizeView>
              <Small>MAIOR PREÇO:</Small>
              <Input value={maxPrice} onChangeText={setMaxPrice} />
            </FullSizeView>
          </FlexView>
          <PrimaryButton onPress={() => { 
            listRef.current.scrollToOffset({ animated: false, offset: 0 });
            searchGames();
            }}>
            <ButtonText>Mostrar resultados</ButtonText>
          </PrimaryButton>
        </Header>
      </FlexGrowView>
      {loading ? //Loading spinner while loading
        <ActivityIndicator size={'large'} />
        :
        <List
          ref={listRef}
          data={list}
          
          //Infinite scroll
          onEndReached={() => {
            searchGames(pageState+1);
          }}
          onEndReachedThreshold={0.1}

          //Loading spinner on infinite scroll
          ListFooterComponent={() => {
            if (!loading) return null;
            return (
              <ActivityIndicator size={'large'} />
            );
          }}

          //Pull to refresh
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => searchGames()} />}

          renderItem={({ item }) => (
            <Game>
              <GameTitle>{item.title}</GameTitle>
              <SpaceBetween>
                <FlexView>
                  <Thumb source={{ uri: item.thumb }} />
                  <MetaCritic style={
                    {
                      backgroundColor: item.metacriticScore > 74 ? '#2C9049' : item.metacriticScore > 49 ? '#E4A10D' : '#AC1717'
                    }
                  }>
                    <BadgeLabel>{item.metacriticScore}</BadgeLabel>
                  </MetaCritic>
                </FlexView>
                <UnalignedFlexView>
                  <NormalPrice>$ {item.normalPrice}</NormalPrice>
                  <SalePrice>$ {item.salePrice}</SalePrice>
                </UnalignedFlexView>
              </SpaceBetween>
            </Game>
          )}
        />
      }
    </FullSizeView>
  );
}