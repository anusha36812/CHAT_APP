import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.134.115:3000'); 

export default function App() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('chat message');
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        renderItem={({ item }) => (
          <Text style={styles.msg}>{item.text} ({item.timestamp})</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Type message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  msg: { marginVertical: 4 }
});
