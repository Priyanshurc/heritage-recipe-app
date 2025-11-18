class Recipe {
  final String? id;
  final String title;
  final String description;
  final List<String> ingredients;
  final List<String> instructions;
  final String? imageUrl;
  final String category;
  final String? cuisine;
  final String? diet;
  final int prepTime;
  final int cookTime;
  final int servings;
  final String userId;
  final DateTime? createdAt;

  Recipe({
    this.id,
    required this.title,
    required this.description,
    required this.ingredients,
    required this.instructions,
    this.imageUrl,
    required this.category,
    this.cuisine,
    this.diet,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    required this.userId,
    this.createdAt,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    // Handle userId which might be a string or an object (when populated)
    String userId = '';
    if (json['userId'] is String) {
      userId = json['userId'];
    } else if (json['userId'] is Map) {
      userId = json['userId']['_id'] ?? '';
    }

    // Convert ingredients list
    List<String> ingredients = [];
    if (json['ingredients'] is List) {
      ingredients = List<String>.from(
        json['ingredients'].map((item) {
          if (item is String) return item;
          return item.toString();
        })
      );
    }

    // Convert instructions list
    List<String> instructions = [];
    if (json['instructions'] is List) {
      instructions = List<String>.from(
        json['instructions'].map((item) {
          if (item is String) return item;
          return item.toString();
        })
      );
    }

    return Recipe(
      id: json['_id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      ingredients: ingredients,
      instructions: instructions,
      imageUrl: json['imageUrl'],
      cuisine: json['cuisine'],
      diet: json['diet'],
      category: json['category'] ?? 'Dinner',
      prepTime: (json['prepTime'] ?? 0).toInt(),
      cookTime: (json['cookTime'] ?? 0).toInt(),
      servings: (json['servings'] ?? 1).toInt(),
      userId: userId,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt'].toString()) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'ingredients': ingredients,
      'instructions': instructions,
      'imageUrl': imageUrl,
      'cuisine': cuisine,
      'diet': diet,
      'category': category,
      'prepTime': prepTime,
      'cookTime': cookTime,
      'servings': servings,
      'userId': userId,
    };
  }
}