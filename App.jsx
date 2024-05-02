import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ModalSelector from 'react-native-modal-selector';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const genres = ['Action', 'Adventure', 'Fantasy', 'Fiction', 'Horror', 'Isekai', 'Mystery', 'Non-Fiction', 'Romance', 'Science Fiction', 'Thriller'];

function Home({ books, lastBook }) {
  const totalNumPages = books.reduce((total, book) => total + parseInt(book.numPages), 0);
  const averageNumPages = books.length > 0 ? totalNumPages / books.length : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.heading]}>Home Screen</Text>
      <Text style={styles.text}>Books Read: {books.length}</Text>
      {lastBook && (
        <View style={styles.bookInfo}>
          <Text style={[styles.text, styles.info]}>Last Book Read:</Text>
          <Text style={styles.text}>Title: {lastBook.title}</Text>
          <Text style={styles.text}>Author: {lastBook.author}</Text>
          <Text style={styles.text}>Genre: {lastBook.genre}</Text>
          <Text style={styles.text}>Number of Pages: {lastBook.numPages}</Text>
        </View>
      )}
      <Text style={styles.text}>Total Number of Pages Read: {totalNumPages}</Text>
      <Text style={styles.text}>Average Number of Pages: {averageNumPages}</Text>
    </View>
  );
}

function AddBookScreen({ addBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [numPages, setNumPages] = useState('');

  const handleAddBook = () => {
    addBook(title, author, selectedGenre, numPages);
    setTitle('');
    setAuthor('');
    setSelectedGenre(null);
    setNumPages('');
  };

  const handleGenreChange = (option) => {
    console.log("Selected Genre:", option.label);
    setSelectedGenre(option.label);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={text => setTitle(text)}
        value={title}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        onChangeText={text => setAuthor(text)}
        value={author}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Pages"
        onChangeText={text => setNumPages(text)}
        value={numPages}
        keyboardType="numeric"
      />
      <ModalSelector
        style={styles.input}
        data={genres.map(genre => ({ key: genre, label: genre }))}
        initValue="Select Genre"
        onChange={handleGenreChange}
      />
      {selectedGenre && (
        <Text style={styles.text}>Selected Genre: {selectedGenre}</Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Text style={styles.addButtonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

function HistoryScreen({ books }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text}>Title: {item.title}</Text>
            <Text style={styles.text}>Author: {item.author}</Text>
            <Text style={styles.text}>Genre: {item.genre}</Text>
            <Text style={styles.text}>Number of Pages: {item.numPages}</Text>
          </View>
        )}
      />
    </View>
  );
}

function GenreScreen() {
  return (
    <View style={[styles.container, styles.centerContent]}>
      {genres.map((genre, index) => (
        <Text style={styles.text} key={index}>{genre}</Text>
      ))}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [books, setBooks] = useState([]);
  const [lastBook, setLastBook] = useState(null);

  const addBook = (title, author, genre, numPages) => {
    if (!title || !author || !genre || !numPages) {
      alert('Please fill in all details.');
      return;
    }
    const newBook = { title, author, genre, numPages };
    setBooks(prevBooks => [newBook, ...prevBooks]);
    setLastBook(newBook);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            display: 'flex'
          }
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabelStyle: {
              fontSize: 15,
              marginBottom: 5,
            },
            tabBarIcon: ({ color, size }) => (
              <Icon name="book" color={"#800000"} size={20} />
            ),
          }}
        >
          {() => <Home books={books} lastBook={lastBook} />}
        </Tab.Screen>

        <Tab.Screen
          name="Add Book"
          options={{
            tabBarLabelStyle: {
              fontSize: 15,
              marginBottom: 5,
            },
            tabBarIcon: ({ color, size }) => (
              <Icon name="pluscircle" color={"#800000"} size={20} />
            ),
          }}
        >
          {() => <AddBookScreen addBook={addBook} />}
        </Tab.Screen>

        <Tab.Screen
          name="History"
          options={{
            tabBarLabelStyle: {
              fontSize: 15,
              marginBottom: 5,
            },
            tabBarIcon: ({ color, size }) => (
              <Icon name="hdd" color={"#800000"} size={20} />
            ),
          }}
        >
          {() => <HistoryScreen books={books} />}
        </Tab.Screen>

        <Tab.Screen
          name="Genre"
          options={{
            tabBarLabelStyle: {
              fontSize: 15,
              marginBottom: 5,
            },
            tabBarIcon: ({ color, size }) => (
              <Icon name="tagso" color={"#800000"} size={20} />
            ),
          }}
        >
          {() => <GenreScreen />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: 'black',
  },
  text: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
  heading: {
    marginBottom: 60,
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 20,
  },
  bookInfo: {
    marginBottom: 50,
  },
  addButton: {
    backgroundColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 150,
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
  },
});
