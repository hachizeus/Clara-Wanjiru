const renderContactItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress(item)}>
        <Image
            source={{ uri: './assets/blankpic.jpg' }}
            style={styles.avatar}
        />
        <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{item.name || 'Unnamed Contact'}</Text>
            <Text style={styles.contactMessage}>{item.lastMessage || "No messages yet"}</Text>
        </View>
        <Text style={styles.chatTime}>12:34 PM</Text>
    </TouchableOpacity>
);
