import React from 'react';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  Droplets, 
  Heart, 
  Brain, 
  Baby, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Apple,
  Fish,
  Egg,
  Milk,
  Wheat,
  Leaf,
  Sparkles
} from 'lucide-react';

const DietInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Decorative Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-200/20 animate-pulse">
          <Heart className="w-32 h-32" fill="currentColor" />
        </div>
        <div className="absolute top-40 right-20 text-purple-200/20 animate-pulse" style={{ animationDelay: '1s' }}>
          <Heart className="w-24 h-24" fill="currentColor" />
        </div>
        <div className="absolute bottom-20 left-32 text-blue-200/20 animate-pulse" style={{ animationDelay: '2s' }}>
          <Heart className="w-28 h-28" fill="currentColor" />
        </div>
        <div className="absolute top-60 right-40 text-green-300/20 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-20 h-20" />
        </div>
        <div className="absolute bottom-40 right-16 text-purple-300/20 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <Heart className="w-16 h-16" fill="currentColor" />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                Diet for Mom and Baby 💕
              </h1>
              <p className="text-gray-600">Scientifically-backed nutritional guidelines 💗</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-white/20 animate-pulse">
            <Heart className="w-16 h-16" fill="currentColor" />
          </div>
          <div className="absolute bottom-4 left-4 text-white/20 animate-pulse" style={{ animationDelay: '1s' }}>
            <Sparkles className="w-12 h-12" />
          </div>
          
          <div className="max-w-3xl relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              Nourishing Two Lives 💕
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Proper nutrition during pregnancy and postpartum is crucial for both maternal health and baby development. 
              This guide provides evidence-based recommendations to ensure optimal nutrition for you and your growing baby 💗
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <Baby className="w-8 h-8 mb-2" />
                <h3 className="font-semibold flex items-center">Baby Development 💕</h3>
                <p className="text-sm opacity-90">Supports optimal growth and brain development</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <Heart className="w-8 h-8 mb-2" />
                <h3 className="font-semibold flex items-center">Maternal Health 💗</h3>
                <p className="text-sm opacity-90">Reduces complications and supports recovery</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 border border-white/30">
                <Brain className="w-8 h-8 mb-2" />
                <h3 className="font-semibold flex items-center">Brain Function 💝</h3>
                <p className="text-sm opacity-90">Enhances cognitive development</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Macronutrients Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-green-200 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 text-green-200/20 animate-pulse">
            <Heart className="w-12 h-12" fill="currentColor" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Essential Macronutrients 💕
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-2 right-2 text-orange-200/20 animate-pulse">
                <Heart className="w-8 h-8" fill="currentColor" />
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <Wheat className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10">Carbohydrates 🌾</h3>
              <p className="text-gray-600 mb-4 relative z-10">Primary energy source for you and baby 💕</p>
              <div className="space-y-2 text-sm relative z-10">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Need:</span>
                  <span className="font-semibold">175-210g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Sources:</span>
                  <span className="font-semibold">Whole grains, fruits</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-orange-100 relative z-10">
                <p className="text-xs text-gray-500">
                  Focus on complex carbohydrates that provide sustained energy and fiber 💗
                </p>
              </div>
            </div>

            <div className="border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-2 right-2 text-red-200/20 animate-pulse" style={{ animationDelay: '0.5s' }}>
                <Heart className="w-8 h-8" fill="currentColor" />
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <Fish className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10">Proteins 🐟</h3>
              <p className="text-gray-600 mb-4 relative z-10">Building blocks for baby's growth 💗</p>
              <div className="space-y-2 text-sm relative z-10">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Need:</span>
                  <span className="font-semibold">71-100g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Sources:</span>
                  <span className="font-semibold">Lean meats, legumes</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-red-100 relative z-10">
                <p className="text-xs text-gray-500">
                  Include both animal and plant-based proteins for complete amino acid profile 💕
                </p>
              </div>
            </div>

            <div className="border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-2 right-2 text-yellow-200/20 animate-pulse" style={{ animationDelay: '1s' }}>
                <Heart className="w-8 h-8" fill="currentColor" />
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 relative z-10">
                <Droplets className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10">Healthy Fats 💧</h3>
              <p className="text-gray-600 mb-4 relative z-10">Essential for brain development 💗</p>
              <div className="space-y-2 text-sm relative z-10">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Need:</span>
                  <span className="font-semibold">20-35% of calories</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Sources:</span>
                  <span className="font-semibold">Avocado, nuts, olive oil</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-100 relative z-10">
                <p className="text-xs text-gray-500">
                  Focus on omega-3 fatty acids (DHA) for optimal brain and eye development 💕
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Nutrients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Leaf className="w-6 h-6 mr-2 text-green-600" />
            Critical Micronutrients
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Folic Acid',
                icon: <Leaf className="w-5 h-5" />,
                amount: '600-800 mcg',
                sources: 'Leafy greens, fortified cereals',
                benefit: 'Prevents neural tube defects'
              },
              {
                name: 'Iron',
                icon: <Heart className="w-5 h-5" />,
                amount: '27 mg',
                sources: 'Red meat, beans, spinach',
                benefit: 'Prevents anemia'
              },
              {
                name: 'Calcium',
                icon: <Milk className="w-5 h-5" />,
                amount: '1000-1300 mg',
                sources: 'Dairy, fortified plant milks',
                benefit: 'Builds strong bones'
              },
              {
                name: 'Vitamin D',
                icon: <Sun className="w-5 h-5" />,
                amount: '600-2000 IU',
                sources: 'Fatty fish, fortified milk',
                benefit: 'Supports immune function'
              },
              {
                name: 'DHA (Omega-3)',
                icon: <Brain className="w-5 h-5" />,
                amount: '200-300 mg',
                sources: 'Fish, algae supplements',
                benefit: 'Brain development'
              },
              {
                name: 'Iodine',
                icon: <Droplets className="w-5 h-5" />,
                amount: '220-290 mcg',
                sources: 'Iodized salt, seafood',
                benefit: 'Thyroid function'
              },
              {
                name: 'Choline',
                icon: <Egg className="w-5 h-5" />,
                amount: '450-550 mg',
                sources: 'Eggs, meat, fish',
                benefit: 'Neural development'
              },
              {
                name: 'Vitamin B12',
                icon: <Apple className="w-5 h-5" />,
                amount: '2.6 mcg',
                sources: 'Animal products, supplements',
                benefit: 'Red blood cell formation'
              }
            ].map((nutrient, index) => (
              <motion.div
                key={nutrient.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    {nutrient.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{nutrient.name}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{nutrient.amount}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{nutrient.sources}</p>
                  <p className="text-green-700 text-xs font-medium">{nutrient.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hydration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 text-white"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Droplets className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Hydration Guidelines</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Daily Requirements</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white/20 backdrop-blur rounded-lg p-3">
                  <span>Pregnancy</span>
                  <span className="font-bold">2.3-3.0 liters</span>
                </div>
                <div className="flex justify-between items-center bg-white/20 backdrop-blur rounded-lg p-3">
                  <span>Breastfeeding</span>
                  <span className="font-bold">3.1-3.8 liters</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Hydration Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Drink water throughout the day, not just when thirsty</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Limit caffeine to 200mg per day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Monitor urine color (pale yellow = well hydrated)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Include water-rich foods like fruits and vegetables</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Foods to Avoid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
            Foods to Limit or Avoid
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">High-Risk Foods</h3>
              {[
                { food: 'Raw or undercooked meat, poultry, eggs', risk: 'Salmonella, Toxoplasmosis' },
                { food: 'Raw seafood (sushi, oysters)', risk: 'Parasites, bacteria' },
                { food: 'Unpasteurized dairy products', risk: 'Listeria' },
                { food: 'Deli meats and hot dogs', risk: 'Listeria (unless heated)' },
                { food: 'Fish high in mercury', risk: 'Brain development issues' }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                  <h4 className="font-medium text-gray-900 mb-1">{item.food}</h4>
                  <p className="text-sm text-red-700">Risk: {item.risk}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Foods to Limit</h3>
              {[
                { food: 'Caffeine', limit: 'Under 200mg/day', reason: 'Can affect baby\'s heart rate' },
                { food: 'Alcohol', limit: 'Complete avoidance', reason: 'Fetal alcohol spectrum disorders' },
                { food: 'High-sugar foods', limit: 'Moderate intake', reason: 'Gestational diabetes risk' },
                { food: 'High-mercury fish', limit: '6 oz per week', reason: 'Mercury accumulation' },
                { food: 'Processed foods', limit: 'Minimal intake', reason: 'Low nutritional value' }
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                  <h4 className="font-medium text-gray-900 mb-1">{item.food}</h4>
                  <p className="text-sm text-yellow-700">Limit: {item.limit}</p>
                  <p className="text-xs text-yellow-600 mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sample Meal Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Daily Meal Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                meal: 'Breakfast',
                time: '7:00 AM',
                items: [
                  'Whole grain toast with avocado',
                  '2 scrambled eggs',
                  '1 cup mixed berries',
                  '1 glass fortified orange juice'
                ],
                nutrients: 'Protein, folate, vitamin C'
              },
              {
                meal: 'Lunch',
                time: '12:30 PM',
                items: [
                  'Grilled salmon (4oz)',
                  'Quinoa salad with vegetables',
                  'Steamed broccoli',
                  '1 cup low-fat milk'
                ],
                nutrients: 'Omega-3, protein, calcium'
              },
              {
                meal: 'Dinner',
                time: '6:00 PM',
                items: [
                  'Lean chicken breast (4oz)',
                  'Sweet potato with skin',
                  'Roasted asparagus',
                  'Mixed green salad with olive oil'
                ],
                nutrients: 'Iron, vitamin A, fiber'
              },
              {
                meal: 'Snack 1',
                time: '10:00 AM',
                items: [
                  'Greek yogurt with honey',
                  'Handful of almonds',
                  '1 small banana'
                ],
                nutrients: 'Protein, healthy fats'
              },
              {
                meal: 'Snack 2',
                time: '3:00 PM',
                items: [
                  'Apple slices with peanut butter',
                  'Hard-boiled egg',
                  'Whole grain crackers'
                ],
                nutrients: 'Fiber, protein, healthy fats'
              },
              {
                meal: 'Evening',
                time: '8:30 PM',
                items: [
                  'Warm milk with turmeric',
                  'Small handful of walnuts',
                  'Chamomile tea'
                ],
                nutrients: 'Calcium, magnesium'
              }
            ].map((meal, index) => (
              <motion.div
                key={meal.meal}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">{meal.meal}</h3>
                  <span className="text-sm text-gray-600">{meal.time}</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700 mb-3">
                  {meal.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-green-700 font-medium">
                  Key nutrients: {meal.nutrients}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Disclaimer</h3>
              <p className="text-sm text-gray-700">
                These nutritional guidelines are based on current scientific research and recommendations from 
                leading health organizations. However, individual nutritional needs may vary based on factors 
                such as pre-existing conditions, multiple pregnancies, or specific dietary restrictions. 
                Always consult with your healthcare provider or a registered dietitian before making significant 
                changes to your diet during pregnancy and breastfeeding.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add missing Sun icon
const Sun = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

export default DietInfoPage;
