const handleSignUp = async () => {
    const { firstName, lastName, email, mobile, countryCode, password } = formData;

    if (!firstName || !lastName || !email || !mobile || !password) {
        Alert.alert( 'Please fill all fields');
        return;
    }

    // Simple regex validation for email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        Alert.alert( 'Please enter a valid email address');
        return;
    }

    // Password validation
    if (password.length < 6) {
        Alert.alert( 'Password must be at least 6 characters long');
        return;
    }

    setLoading(true);

    try {
        const response = await axios.post('http://192.168.1.7:5000/api/signup', {
            firstName,
            lastName,
            email,
            mobile,
            countryCode,
            password,
        }, { timeout: 10000 }); // Adding a 10-second timeout for the request

        if (response.status === 200) {
            Alert.alert('Success', 'User registered successfully');
            navigation.navigate('Login');
        } else {
            Alert.alert( response.data.message || 'SignUp failed');
        }
    } catch (error) {
        console.error('Sign Up Error:', error.message || error.response?.data);
        Alert.alert( error.response?.data.message || 'Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
};
