import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

const ContactsComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  // Function to request contact permission
  const requestContactsPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    if (status === 'granted') {
      setPermissionGranted(true);
      fetchContacts();
    } else {
      console.error("Permission not granted");
    }
  };

  // Function to fetch contacts
  const fetchContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        setContacts(data);
      } else {
        console.log('No contacts found');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  if (!permissionGranted) {
    return <Text>Permission not granted to access contacts</Text>;
  }

  return (
    <View>
      <Text>Contacts List:</Text>
      {contacts.map((contact) => (
        <Text key={contact.id}>
          {contact.name} - {contact.phoneNumbers ? contact.phoneNumbers[0].number : 'No number available'}
        </Text>
      ))}
      <Button title="Reload Contacts" onPress={fetchContacts} />
    </View>
  );
};

export default ContactsComponent;
