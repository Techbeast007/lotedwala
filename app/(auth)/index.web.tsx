import React, { useState, useEffect } from 'react';
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    PhoneAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Spinner } from '@/components/ui/spinner';
import { Toast } from '@/components/ui/toast';
import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import { getApps, initializeApp } from 'firebase/app';
import { InfoIcon } from "@/components/ui/icon"
import firebaseConfig from '@/firebaseConfig'; // Ensure this is the correct path to your Firebase config

// Initialize Firebase for web if not already initialized
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                router.push('/(tabs)'); // Redirect to home if user exists
            }
        };
        checkUser();
    }, []);

    const isValidPhoneNumber = (phone: string) => {
        const phoneRegex = /^[+]?[0-9]{10,15}$/; // Adjust regex as needed
        return phoneRegex.test(phone);
    };

    const sendVerificationCode = async () => {
        if (!isValidPhoneNumber(phoneNumber)) {
            setAlert({ type: 'error', message: 'Please enter a valid phone number' });
            return;
        }

        try {
            setLoading(true);
            const auth = getAuth();

            // Initialize RecaptchaVerifier
            const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log('Recaptcha verified');
                },
            });

            // Send verification code
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
            setVerificationId(confirmationResult.verificationId);
            setIsCodeSent(true);
            setAlert({ type: 'success', message: 'Verification code sent to your phone' });
        } catch (error) {
            console.error('Error sending verification code:', error);
            setAlert({ type: 'error', message: 'Failed to send verification code. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        if (!code) {
            setAlert({ type: 'error', message: 'Please enter the verification code' });
            return;
        }

        try {
            setLoading(true);
            const auth = getAuth();
            const credential = PhoneAuthProvider.credential(verificationId!, code);
            const userCredential = await signInWithCredential(auth, credential);

            // Save user data to local storage
            const userData = {
                user: userCredential.user,
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect to onboarding if new user
            router.push('/on-boarding');
        } catch (error) {
            console.error('Error verifying code:', error);
            setAlert({ type: 'error', message: 'Failed to verify code. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex-1 justify-center items-center p-4">
            <VStack className="space-y-6 w-11/12">
                <Heading size="lg" className="text-center">
                    Log in to start your journey
                </Heading>

                {alert && (
                   
                    <Alert action="muted" variant="solid">
                    <AlertIcon as={InfoIcon} />
                    <AlertText>{alert.message}</AlertText>
                  </Alert>
                )}

                <div id="recaptcha-container"></div> {/* Required for Firebase Phone Auth */}

                {!isCodeSent ? (
                    <>
                        <Input variant="outline" size="md">
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
                            isDisabled={loading}
                        >
                            {loading ? <Spinner size="small" /> : <ButtonText>Send Code</ButtonText>}
                        </Button>
                    </>
                ) : (
                    <>
                        <Input variant="outline" size="md">
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
                            isDisabled={loading}
                        >
                            {loading ? <Spinner size="small" /> : <ButtonText>Verify Code</ButtonText>}
                        </Button>
                    </>
                )}
            </VStack>

            <Toast />
        </Box>
    );
};

export default LoginScreen;