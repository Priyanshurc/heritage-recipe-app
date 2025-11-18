import 'package:flutter/material.dart';
import '../models/recipe_model.dart';
import '../services/api_service.dart';

class AddRecipeScreen extends StatefulWidget {
  const AddRecipeScreen({Key? key}) : super(key: key);

  @override
  State<AddRecipeScreen> createState() => _AddRecipeScreenState();
}

class _AddRecipeScreenState extends State<AddRecipeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _imageUrlController = TextEditingController();
  final _ingredientController = TextEditingController();
  final _instructionController = TextEditingController();
  
  final List<String> _ingredients = [];
  final List<String> _instructions = [];
  
  String _selectedCategory = 'Breakfast';
  int _prepTime = 15;
  int _cookTime = 30;
  int _servings = 4;
  bool _isLoading = false;
  bool _isEditing = false;
  String? _editingId;

  final List<String> _categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snacks',
    'Drinks',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _imageUrlController.dispose();
    _ingredientController.dispose();
    _instructionController.dispose();
    super.dispose();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // Check for editing arguments passed via Navigator
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is Map<String, dynamic>) {
      final recipeMap = args;
      if (!_isEditing) {
        _isEditing = true;
        _editingId = recipeMap['_id'] ?? recipeMap['id']?.toString();
        // populate fields
        _titleController.text = recipeMap['title'] ?? '';
        _descriptionController.text = recipeMap['description'] ?? '';
        _imageUrlController.text = recipeMap['imageUrl'] ?? '';
        _selectedCategory = recipeMap['category'] ?? _selectedCategory;
        _prepTime = (recipeMap['prepTime'] ?? _prepTime) is int
            ? (recipeMap['prepTime'] ?? _prepTime)
            : int.tryParse((recipeMap['prepTime'] ?? '0').toString()) ?? _prepTime;
        _cookTime = (recipeMap['cookTime'] ?? _cookTime) is int
            ? (recipeMap['cookTime'] ?? _cookTime)
            : int.tryParse((recipeMap['cookTime'] ?? '0').toString()) ?? _cookTime;
        _servings = (recipeMap['servings'] ?? _servings) is int
            ? (recipeMap['servings'] ?? _servings)
            : int.tryParse((recipeMap['servings'] ?? '1').toString()) ?? _servings;

        // ingredients/instructions may be List<dynamic>
        final ing = recipeMap['ingredients'];
        if (ing is List) {
          _ingredients.clear();
          _ingredients.addAll(ing.map((e) => e.toString()));
        }

        final instr = recipeMap['instructions'];
        if (instr is List) {
          _instructions.clear();
          _instructions.addAll(instr.map((e) => e.toString()));
        }
      }
    }
  }

  void _addIngredient() {
    if (_ingredientController.text.isNotEmpty) {
      setState(() {
        _ingredients.add(_ingredientController.text);
        _ingredientController.clear();
      });
    }
  }

  void _addInstruction() {
    if (_instructionController.text.isNotEmpty) {
      setState(() {
        _instructions.add(_instructionController.text);
        _instructionController.clear();
      });
    }
  }

  Future<void> _saveRecipe() async {
    if (!_formKey.currentState!.validate()) return;
    
    if (_ingredients.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one ingredient')),
      );
      return;
    }
    
    if (_instructions.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one instruction')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final recipe = Recipe(
        id: _isEditing ? _editingId : null,
        title: _titleController.text,
        description: _descriptionController.text,
        ingredients: _ingredients,
        instructions: _instructions,
        imageUrl: _imageUrlController.text.isEmpty ? null : _imageUrlController.text,
        category: _selectedCategory,
        prepTime: _prepTime,
        cookTime: _cookTime,
        servings: _servings,
        userId: '', // Will be set by backend from token
      );

      final result = _isEditing && _editingId != null
          ? await ApiService.updateRecipe(_editingId!, recipe)
          : await ApiService.createRecipe(recipe);
      
      if (result['success']) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(_isEditing ? 'Recipe updated successfully!' : 'Recipe created successfully!')),
          );
          Navigator.pop(context);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(result['error'] ?? 'Failed to create recipe')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Recipe' : 'Add Recipe'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Recipe Title',
                border: OutlineInputBorder(),
              ),
              validator: (value) =>
                  value?.isEmpty ?? true ? 'Please enter a title' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
              validator: (value) =>
                  value?.isEmpty ?? true ? 'Please enter a description' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _imageUrlController,
              decoration: const InputDecoration(
                labelText: 'Image URL (optional)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: const InputDecoration(
                labelText: 'Category',
                border: OutlineInputBorder(),
              ),
              items: _categories.map((category) {
                return DropdownMenuItem(
                  value: category,
                  child: Text(category),
                );
              }).toList(),
              onChanged: (value) {
                if (value != null) {
                  setState(() => _selectedCategory = value);
                }
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Prep Time (min)'),
                      Slider(
                        value: _prepTime.toDouble(),
                        min: 5,
                        max: 120,
                        divisions: 23,
                        label: '$_prepTime min',
                        onChanged: (value) {
                          setState(() => _prepTime = value.toInt());
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Cook Time (min)'),
                      Slider(
                        value: _cookTime.toDouble(),
                        min: 5,
                        max: 180,
                        divisions: 35,
                        label: '$_cookTime min',
                        onChanged: (value) {
                          setState(() => _cookTime = value.toInt());
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Servings: '),
                IconButton(
                  icon: const Icon(Icons.remove),
                  onPressed: () {
                    if (_servings > 1) {
                      setState(() => _servings--);
                    }
                  },
                ),
                Text('$_servings', style: const TextStyle(fontSize: 18)),
                IconButton(
                  icon: const Icon(Icons.add),
                  onPressed: () {
                    setState(() => _servings++);
                  },
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text(
              'Ingredients',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ingredientController,
                    decoration: const InputDecoration(
                      hintText: 'Add ingredient',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.add_circle),
                  color: Colors.orange,
                  onPressed: _addIngredient,
                ),
              ],
            ),
            const SizedBox(height: 8),
            ..._ingredients.asMap().entries.map((entry) {
              return ListTile(
                leading: const Icon(Icons.check_circle_outline),
                title: Text(entry.value),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {
                    setState(() => _ingredients.removeAt(entry.key));
                  },
                ),
              );
            }).toList(),
            const SizedBox(height: 24),
            const Text(
              'Instructions',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _instructionController,
                    decoration: const InputDecoration(
                      hintText: 'Add instruction',
                      border: OutlineInputBorder(),
                    ),
                    maxLines: 2,
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.add_circle),
                  color: Colors.orange,
                  onPressed: _addInstruction,
                ),
              ],
            ),
            const SizedBox(height: 8),
            ..._instructions.asMap().entries.map((entry) {
              return ListTile(
                leading: CircleAvatar(
                  child: Text('${entry.key + 1}'),
                ),
                title: Text(entry.value),
                trailing: IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {
                    setState(() => _instructions.removeAt(entry.key));
                  },
                ),
              );
            }).toList(),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _saveRecipe,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : Text(_isEditing ? 'Save Changes' : 'Save Recipe'),
            ),
          ],
        ),
      ),
    );
  }
}