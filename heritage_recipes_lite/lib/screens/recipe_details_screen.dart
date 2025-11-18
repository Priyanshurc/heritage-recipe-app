import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RecipeDetailsScreen extends StatefulWidget {
  final Map<String, dynamic> recipe;

  const RecipeDetailsScreen({Key? key, required this.recipe}) : super(key: key);

  @override
  State<RecipeDetailsScreen> createState() => _RecipeDetailsScreenState();
}

class _RecipeDetailsScreenState extends State<RecipeDetailsScreen> {
  bool _isFavorite = false;
  late Map<String, dynamic> _recipe;

  Future<void> _toggleFavorite() async {
    try {
      await ApiService.toggleFavorite(widget.recipe['_id']);
      setState(() => _isFavorite = !_isFavorite);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_isFavorite ? 'Added to favorites' : 'Removed from favorites'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  void initState() {
    super.initState();
    // Initialize local recipe map from widget
    _recipe = Map<String, dynamic>.from(widget.recipe);
  }

  Future<void> _refreshRecipe() async {
    try {
      final id = _recipe['_id'] ?? _recipe['id'];
      if (id == null) return;
      final updated = await ApiService.getRecipeById(id.toString());
      // convert Recipe model to Map representation used in UI
      final updatedMap = updated.toJson();
      updatedMap['_id'] = updated.id;
      setState(() => _recipe = updatedMap);
    } catch (e) {
      // ignore refresh errors
    }
  }

  @override
  Widget build(BuildContext context) {
  final recipe = _recipe;
  final ingredients = List<String>.from(recipe['ingredients'] ?? []);
  final instructions = List<String>.from(recipe['instructions'] ?? []);

    return Scaffold(
      appBar: AppBar(
        title: Text(recipe['title']),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () async {
              // Open AddRecipeScreen in edit mode by passing the recipe map
              await Navigator.pushNamed(context, '/add-recipe', arguments: recipe);
              // After returning, refresh recipe details from API
              await _refreshRecipe();
            },
          ),
          IconButton(
            icon: Icon(_isFavorite ? Icons.favorite : Icons.favorite_border),
            onPressed: _toggleFavorite,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (recipe['imageUrl'] != null)
              Image.network(
                recipe['imageUrl'],
                width: double.infinity,
                height: 250,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 250,
                    color: Colors.grey[300],
                    child: const Icon(Icons.restaurant, size: 64),
                  );
                },
              )
            else
              Container(
                height: 250,
                color: Colors.grey[300],
                child: const Center(
                  child: Icon(Icons.restaurant, size: 64, color: Colors.grey),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Chip(
                    label: Text(recipe['category'] ?? 'Uncategorized'),
                    backgroundColor: Colors.orange[100],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    recipe['title'],
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    recipe['description'] ?? '',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildInfoCard(
                        Icons.schedule,
                        'Prep',
                        '${recipe['prepTime']} min',
                      ),
                      _buildInfoCard(
                        Icons.timer,
                        'Cook',
                        '${recipe['cookTime']} min',
                      ),
                      _buildInfoCard(
                        Icons.people,
                        'Servings',
                        '${recipe['servings']}',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Ingredients',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...ingredients.map((ingredient) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle, color: Colors.orange),
                          const SizedBox(width: 8),
                          Expanded(child: Text(ingredient)),
                        ],
                      ),
                    );
                  }).toList(),
                  const SizedBox(height: 24),
                  const Text(
                    'Instructions',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...instructions.asMap().entries.map((entry) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundColor: Colors.orange,
                            child: Text(
                              '${entry.key + 1}',
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              entry.value,
                              style: const TextStyle(fontSize: 16),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(IconData icon, String label, String value) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(icon, color: Colors.orange),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}