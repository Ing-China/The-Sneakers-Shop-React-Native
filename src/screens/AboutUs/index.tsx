import {Text, View} from 'react-native';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../hooks';

const AboutUsScreen: React.FC = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: colors.primary}]}>
      <Text style={[styles.name, {color: colors.text}]}>The Sneakers Shop</Text>
      <Text style={[styles.label, {color: colors.text}]}>{t('vision')}</Text>
      <Text style={[styles.visionDescription, {color: colors.text}]}>
        {t('visions')}
      </Text>
      <Text style={[styles.label, {color: colors.text}]}>{t('mission')}</Text>
      <Text style={[styles.visionDescription, {color: colors.text}]}>
        {t('missions')}
      </Text>
      <Text style={[styles.copyRight, {color: colors.text}]}>
        © 2024 The Sneaker. All rights reserved.
      </Text>
    </View>
  );
};

export default AboutUsScreen;
