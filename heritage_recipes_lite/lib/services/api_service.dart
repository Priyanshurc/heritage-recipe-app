import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/recipe_model.dart';

class ApiService {
  // For Linux/Mac/Windows desktop development, use localhost:5000
  // For Android emulator, use 10.0.2.2:5000 (special IP for emulator to reach host)
  // For iOS emulator, use localhost or your host IP
  static const String baseUrl = 'http://localhost:5000/api';
  
  // Auth methods
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _saveToken(data['token']);
      return {'success': true, 'data': data};
    } else {
      return {'success': false, 'error': jsonDecode(response.body)['error']};
    }
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      await _saveToken(data['token']);
      return {'success': true, 'data': data};
    } else {
      return {'success': false, 'error': jsonDecode(response.body)['error']};
    }
  }

  // Recipe methods
  static Future<List<Recipe>> getRecipes({String? search, String? category}) async {
    final token = await _getToken();
    String url = '$baseUrl/recipes';
    
    List<String> params = [];
    if (search != null && search.isNotEmpty) params.add('search=$search');
    if (category != null && category.isNotEmpty) params.add('category=$category');
    
    if (params.isNotEmpty) url += '?${params.join('&')}';

    final response = await http.get(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      try {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) {
          try {
            return Recipe.fromJson(json);
          } catch (e) {
            print('Error parsing recipe: $e');
            print('Recipe data: $json');
            rethrow;
          }
        }).toList();
      } catch (e) {
        throw Exception('Error loading recipes: $e');
      }
    } else {
      throw Exception('Failed to load recipes: ${response.statusCode}');
    }
  }

  static Future<Recipe> getRecipeById(String id) async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/recipes/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return Recipe.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load recipe');
    }
  }

  static Future<Map<String, dynamic>> createRecipe(Recipe recipe) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/recipes'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(recipe.toJson()),
    );

    if (response.statusCode == 201) {
      return {'success': true, 'data': Recipe.fromJson(jsonDecode(response.body))};
    } else {
      return {'success': false, 'error': jsonDecode(response.body)['error']};
    }
  }

  static Future<Map<String, dynamic>> updateRecipe(String id, Recipe recipe) async {
    final token = await _getToken();
    final response = await http.put(
      Uri.parse('$baseUrl/recipes/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(recipe.toJson()),
    );

    if (response.statusCode == 200) {
      return {'success': true, 'data': Recipe.fromJson(jsonDecode(response.body))};
    } else {
      return {'success': false, 'error': jsonDecode(response.body)['error']};
    }
  }

  static Future<bool> deleteRecipe(String id) async {
    final token = await _getToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/recipes/$id'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    return response.statusCode == 200;
  }

  static Future<List<Recipe>> getFavorites() async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/recipes/favorites'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Recipe.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load favorites');
    }
  }

  static Future<bool> toggleFavorite(String recipeId) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/recipes/$recipeId/favorite'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    return response.statusCode == 200;
  }

  // Token management
  static Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  static Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  static Future<bool> isLoggedIn() async {
    final token = await _getToken();
    return token != null;
  }
}