import {Alert, FlatList, Platform, ScrollView, Text, View} from 'react-native';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {
  useFavorite,
  useProductDetail,
  useRelatedProducts,
  useTheme,
} from '../../hooks';
import {
  AnimatedDotLoader,
  FlexibleSwiper,
  Footer,
  ItemSeparatorHeight,
  ProductItem,
  Section,
  Skeleton,
  Touchable,
  VariantItem,
} from '../../components';
import IconButton from '../../components/IconButton';
import {Icons, Padding, Radius, Spacing} from '../../constants';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProductItemProps, StackParamList, VariantProps} from '../../types';
import PriceTag from '../../components/PriceTag';
import RatingTag from '../../components/RatingTag';
import React from 'react';
import  {dummyProducts} from '../../models/Product';
import {variants} from '../../models/Variant';
const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const route = useRoute<RouteProp<StackParamList, 'ProductDetail'>>();
  const {id} = route.params;
  const {t} = useTranslation();
  const {colors} = useTheme();

  const {
    isLoading,
    productDetail,
    activeVariant,
    price,
    setActiveVariant,
    setSize,
    setPrice,
  } = useProductDetail(id);

  const {products, isFetchingMoreProducts, fetchMoreProducts} =
    useRelatedProducts(productDetail?.brandId);

  const {isFavorite, toggleItemFavorite} = useFavorite();

  const navigateBack = () => {
    return navigation.goBack();
  };

  const navigateToCart = () => {
    return navigation.navigate('Cart');
  };

  const addToCart = () => {
    return Alert.alert('Add to cart');
  };

  const goToCheckout = () => {
    return Alert.alert('Go to checkout');
  };

  const variantItem = ({
    item,
    index,
  }: {
    item: VariantProps['item'];
    index: number;
  }) => {
    return (
      <VariantItem
        onPress={() => {
          setActiveVariant(index);
          setSize(item.size);
          setPrice(item.price);
        }}
        item={item}
        isActive={activeVariant === index}
        containerStyle={{marginLeft: Spacing.DEFAULT}}
      />
    );
  };

  const productItem = ({
    item,
    index,
  }: {
    item: ProductItemProps['item'];
    index: number;
  }) => {
    return (
      <ProductItem
        item={item}
        onPress={() => handlePressOnProduct(item.id)}
        wrapperStyle={[
          styles.productWrapper,
          {marginRight: index % 2 === 0 ? Spacing.DEFAULT : 0},
        ]}
      />
    );
  };

  const handlePressOnProduct = (id: number) => {
    navigation.replace('ProductDetail', {id});
  };

  const handleScroll = ({nativeEvent}: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom && !isFetchingMoreProducts) {
      fetchMoreProducts();
    }
  };

  const ProductItemSkeleton = ({index}: {index: number}) => {
    return (
      <Skeleton
        containerStyle={[
          styles.productWrapper,
          {
            marginRight: index % 2 === 0 ? Spacing.DEFAULT : 0,
            borderRadius: Radius.DEFAULT,
            height: 240,
            width: 80,
          },
        ]}
      />
    );
  };

  const variantSkeleton = () => {
    return (
      <Skeleton
        containerStyle={{
          height: 50,
          marginLeft: Spacing.DEFAULT,
          borderRadius: Radius.DEFAULT,
        }}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.primary}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {productDetail && (
          <>
            {isLoading ? (
              <Skeleton
                containerStyle={{
                  height: 400,
                }}
              />
            ) : (
              <FlexibleSwiper
                imageUrlList={productDetail.images}
                imageStyle={[
                  styles.swiperImageStyle,
                  {backgroundColor: colors.primary},
                ]}
                containerStyle={[
                  styles.swiperContainer,
                  {backgroundColor: colors.primary},
                ]}
                loadingImageStyle={[
                  styles.swiperLoadingImageStyle,
                  {backgroundColor: colors.primary},
                ]}
                iconSize={150}
                autoPlay={false}
                resizeMode="contain"
              />
            )}

            <View style={styles.body}>
              <View
                style={[
                  styles.container1,
                  {backgroundColor: colors.secondary},
                ]}>
                {isLoading ? (
                  <Skeleton
                    containerStyle={{
                      height: 25,
                      borderRadius: Radius.SMALL,
                    }}
                  />
                ) : (
                  <>
                    <Text style={[styles.name, {color: colors.text}]}>
                      {productDetail.name}
                    </Text>

                    <IconButton
                      onPress={() => toggleItemFavorite(productDetail)}
                      icon={
                        <Icons.HEART
                          color={
                            isFavorite(productDetail.id) ? 'none' : colors.text
                          }
                          fill={
                            isFavorite(productDetail.id) ? colors.text : 'none'
                          }
                        />
                      }
                      style={[
                        styles.heartContainer,
                        {backgroundColor: colors.primary},
                      ]}
                    />
                  </>
                )}

                {isLoading ? (
                  <Skeleton
                    containerStyle={{
                      height: 25,
                      borderRadius: Radius.SMALL,
                    }}
                  />
                ) : (
                  <View style={styles.priceContaner}>
                    <PriceTag
                      price={price}
                      promotion={'100'}
                      priceStyle={styles.priceStyle}
                      defaultPriceStyle={styles.defaultPriceStyle}
                    />

                    <View
                      style={[
                        styles.discountContainer,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Text style={[styles.discount, {color: colors.text}]}>
                        5% OFF
                      </Text>
                    </View>
                  </View>
                )}

                {isLoading ? (
                  <Skeleton
                    containerStyle={{
                      height: 20,
                      width: 20,
                      borderRadius: Radius.DEFAULT * 2,
                    }}
                  />
                ) : (
                  <RatingTag
                    averageRating={productDetail.rating}
                    totalRating={productDetail.rating}
                    averageRatingStyle={styles.averageRatingStyle}
                    totalRatingStyle={styles.totalRatingStyle}
                  />
                )}
              </View>

              <View
                style={[
                  styles.container2,
                  {backgroundColor: colors.secondary},
                ]}>
                {isLoading ? (
                  <>
                    <Skeleton
                      containerStyle={{
                        height: 20,
                        borderRadius: Radius.SMALL,
                      }}
                    />

                    <Skeleton
                      containerStyle={{
                        height: 40,
                        borderRadius: Radius.SMALL,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Text style={[styles.description, {color: colors.text}]}>
                      {t('description')}
                    </Text>
                    <Text
                      style={[styles.descriptionValue, {color: colors.text}]}>
                      {productDetail.description}
                    </Text>
                  </>
                )}
              </View>

              <View
                style={[
                  styles.container3,
                  {backgroundColor: colors.secondary},
                ]}>
                {isLoading ? (
                  <>
                    <Skeleton
                      containerStyle={{
                        height: 20,
                        width: 200,
                        marginTop: Spacing.DEFAULT,
                        marginHorizontal: Spacing.DEFAULT,
                        borderRadius: Radius.SMALL,
                      }}
                    />
                    <FlatList
                      data={variants}
                      renderItem={variantSkeleton}
                      numColumns={3}
                      scrollEnabled={false}
                      ItemSeparatorComponent={ItemSeparatorHeight}
                      keyExtractor={item => item.id.toString()}
                    />
                  </>
                ) : (
                  <>
                    <Text style={[styles.selectOption, {color: colors.text}]}>
                      {t('selectOption')}
                    </Text>
                    <FlatList
                      data={productDetail.variants}
                      renderItem={variantItem}
                      numColumns={3}
                      scrollEnabled={false}
                      ItemSeparatorComponent={ItemSeparatorHeight}
                      keyExtractor={item => item.id.toString()}
                    />
                  </>
                )}
              </View>
            </View>
          </>
        )}

        <IconButton
          onPress={navigateBack}
          icon={
            Platform.OS === 'ios' ? (
              <Icons.ARROWLEFT color={colors.text} width={23} height={23} />
            ) : (
              <Icons.LEFTARROWANDROID
                color={colors.text}
                width={30}
                height={30}
              />
            )
          }
          style={[styles.backContainer]}
        />

        <IconButton
          onPress={navigateToCart}
          icon={<Icons.CART color={colors.text} width={25} height={25} />}
          style={[styles.cartContainer]}
        />

        {productDetail && (
          <>
            {isLoading ? (
              <>
                <Skeleton
                  containerStyle={{
                    height: 20,
                    width: 200,
                    marginTop: Spacing.DEFAULT,
                    marginHorizontal: Spacing.DEFAULT,
                    borderRadius: Radius.SMALL,
                  }}
                />
                <Section>
                  <FlatList
                    data={dummyProducts}
                    numColumns={2}
                    scrollEnabled={false}
                    renderItem={ProductItemSkeleton}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={ItemSeparatorHeight}
                    contentContainerStyle={[
                      styles.contentContainer,
                      {paddingBottom: Padding.BOTTOM * 2},
                    ]}
                    keyExtractor={item => item.id.toString()}
                  />
                </Section>
              </>
            ) : (
              <>
                <Section
                  title={t('relatedProduct')}
                  titleStyle={styles.titleStyle}>
                  <FlatList
                    data={products}
                    numColumns={2}
                    renderItem={productItem}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={ItemSeparatorHeight}
                    contentContainerStyle={styles.contentContainer}
                    keyExtractor={item => item.id.toString()}
                  />
                </Section>
                <AnimatedDotLoader
                  isLoading={isFetchingMoreProducts}
                  containerStyle={styles.fetchMoreLoaderContainer}
                />
              </>
            )}
          </>
        )}
      </ScrollView>

      {isLoading ? null : (
        <Footer
          safeAreaStyle={[
            styles.safeAreaStyle,
            {backgroundColor: colors.primary},
          ]}
          contentContainerStyle={[styles.footerContainer]}>
          <Touchable
            onPress={addToCart}
            style={[
              styles.buttonAddToCart,
              {backgroundColor: colors.secondary},
            ]}>
            <Text style={[styles.addToCart, {color: colors.text}]}>
              {t('addToCart')}
            </Text>
          </Touchable>
          <Touchable
            onPress={goToCheckout}
            style={[
              styles.buttonAddToCart,
              {backgroundColor: colors.primaryReversed},
            ]}>
            <Text style={[styles.addToCart, {color: colors.textReversed}]}>
              {t('buyNow')}
            </Text>
          </Touchable>
        </Footer>
      )}
    </View>
  );
};

export default ProductDetailScreen;
