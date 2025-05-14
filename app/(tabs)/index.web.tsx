import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';

export default function HomeScreen() {
    return (
        <GluestackUIProvider>
            <Card className="p-5 rounded-lg max-w-[360px] m-3">
      <Image
        source={{
          uri: "https://gluestack.github.io/public-blog-video-assets/saree.png",
        }}
        className="mb-6 h-[240px] w-full rounded-md aspect-[4/3]"
        alt="image"
      />
      <Text className="text-sm font-normal mb-2 text-typography-700">
        Fashion Clothing
      </Text>
      <VStack className="mb-6">
        <Heading size="md" className="mb-4">
          Cotton Kurta
        </Heading>
        <Text size="sm">
          Floral embroidered notch neck thread work cotton kurta in white and
          black.
        </Text>
      </VStack>
      <Box className="flex-col sm:flex-row">
        <Button className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1">
          <ButtonText size="sm">Add to cart</ButtonText>
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 border-outline-300 sm:flex-1"
        >
          <ButtonText size="sm" className="text-typography-600">
            Wishlist
          </ButtonText>
        </Button>
      </Box>
    </Card>
            <ScrollView>
            <Box className="bg-[#A1CEDC] dark:bg-[#1D3D47] relative h-50">
                <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo}
                />
            </Box>
            <Box className="px-4 py-6">
                <Box className="flex-row items-center gap-2">
                <Text className="text-2xl font-bold">
                    Welcome!
                </Text>
                <HelloWave />
                </Box>
                <Box className="mt-4 gap-2">
                <Text className="text-lg font-semibold">
                    Step 1: Try it
                </Text>
                <Text>
                    Edit <Text className="font-semibold">app/(tabs)/index.tsx</Text> to see changes. Press{' '}
                    <Text className="font-semibold">
                    {Platform.select({
                        ios: 'cmd + d',
                        android: 'cmd + m',
                        web: 'F12',
                    })}
                    </Text>{' '}
                    to open developer tools.
                </Text>
                </Box>
                <Box className="mt-4 gap-2">
                <Text className="text-lg font-semibold">
                    Step 2: Explore
                </Text>
                <Text>
                    {`Tap the Explore tab to learn more about what's included in this starter app.`}
                </Text>
                </Box>
                <Box className="mt-4 gap-2">
                <Text className="text-lg font-semibold">
                    Step 3: Get a fresh start
                </Text>
                <Text>
                    {`When you're ready, run `}
                    <Text className="font-semibold">npm run reset-project</Text> to get a fresh{' '}
                    <Text className="font-semibold">app</Text> directory. This will move the current{' '}
                    <Text className="font-semibold">app</Text> to{' '}
                    <Text className="font-semibold">app-example</Text>.
                </Text>
                </Box>
            </Box>
            </ScrollView>
        </GluestackUIProvider>
    );
}

const styles = StyleSheet.create({
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
