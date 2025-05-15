import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    router.push('/(tabs)'); // Redirect to home if user exists
                }
            } catch (error) {
                console.error('Failed to fetch user from AsyncStorage:', error);
            }
        };
        checkUser();
    }, []);

    const isValidPhoneNumber = (phone: any) => {
        const phoneRegex = /^[+]?[0-9]{10,15}$/; // Adjust regex as needed
        return phoneRegex.test(phone);
    };

    const sendVerificationCode = async () => {
        if (!isValidPhoneNumber(phoneNumber)) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setVerificationId(confirmation.verificationId);
            setIsCodeSent(true);
            Alert.alert('Success', 'Verification code sent to your phone');
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    const verifyCode = async () => {
        if (!code) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }

        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            const userCredential = await auth().signInWithCredential(credential);

            // Store user in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));

            // Redirect to onboarding if new user
            router.push('/on-boarding');
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    return (
        <Box className="flex-1 justify-center items-center p-4">
            <VStack className="space-y-4 w-11/12">
                {!isCodeSent ? (
                    <>
                        <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                            <InputField
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </Input>
                        <Button
                            onPress={sendVerificationCode}
                            className="bg-blue-500 text-white py-3 px-4 rounded-md"
                        ><ButtonText>Send Code</ButtonText>
                            
                        </Button>
                    </>
                ) : (
                    <>
                        <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false}>
                            <InputField
                                placeholder="Verification Code"
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </Input>
                        <Button
                            onPress={verifyCode}
                            className="bg-green-500 text-white py-3 px-4 rounded-md"
                        >
                            <ButtonText>Verify Code</ButtonText>
                        </Button>
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default LoginScreen;