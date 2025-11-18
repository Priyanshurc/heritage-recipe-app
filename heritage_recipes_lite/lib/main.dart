import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/add_recipe_screen.dart';
import 'screens/recipe_details_screen.dart';

void main() {
  runApp(const RecipeApp());
}

class RecipeApp extends StatelessWidget {
  const RecipeApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Create a text theme that supports Unicode scripts like Devanagari
    final baseTextTheme = Theme.of(context).textTheme;
    final textTheme = baseTextTheme.apply(
      // Use system fonts that support Devanagari
      fontFamily: 'Noto Sans', // Linux system font that supports Devanagari
    );

    return MaterialApp(
      title: 'Recipe App',
      theme: ThemeData(
        primarySwatch: Colors.orange,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        textTheme: textTheme,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/add-recipe': (context) => const AddRecipeScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/recipe-details') {
          final recipe = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => RecipeDetailsScreen(recipe: recipe),
          );
        }
        return null;
      },
    );
  }
}