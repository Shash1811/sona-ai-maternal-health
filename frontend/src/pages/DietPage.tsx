import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, Heart, Scale, Droplets, Apple, Coffee, Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  height: string;
  weight: string;
  stage: string;
  dietaryPreference: string;
}

interface NutritionPlan {
  title: string;
  description: string;
  keyNutrients: Array<{
    name: string;
    amount: string;
    foodSources: string[];
    icon: React.ReactNode;
  }>;
  dailyCalories: string;
  hydration: string;
  tips: string[];
}

const DietPage = () => {
  const [formData, setFormData] = useState<FormData>({
    height: '',
    weight: '',
    stage: '',
    dietaryPreference: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);

  const getNutritionPlan = (stage: string, preference: string): NutritionPlan => {
    const basePlans = {
      'Pre-pregnancy': {
        title: 'Pre-Pregnancy Nutrition Foundation',
        description: 'Build your nutritional reserves for a healthy pregnancy journey',
        keyNutrients: [
          {
            name: 'Folic Acid',
            amount: '400-800 mcg',
            foodSources: ['Leafy greens', 'Fortified cereals', 'Beans'],
            icon: <Heart className="w-5 h-5 text-green-500" />
          },
          {
            name: 'Iron',
            amount: '18 mg',
            foodSources: ['Red meat', 'Spinach', 'Lentils'],
            icon: <Droplets className="w-5 h-5 text-red-500" />
          },
          {
            name: 'Calcium',
            amount: '1000 mg',
            foodSources: ['Dairy', 'Almonds', 'Kale'],
            icon: <Baby className="w-5 h-5 text-blue-500" />
          }
        ],
        dailyCalories: '2000-2200',
        hydration: '8-10 glasses',
        tips: ['Start taking prenatal vitamins', 'Maintain healthy weight', 'Limit caffeine intake']
      },
      '1st Trimester': {
        title: 'First Trimester Vitality',
        description: 'Support early development and manage morning sickness',
        keyNutrients: [
          {
            name: 'Folate',
            amount: '600-800 mcg',
            foodSources: ['Asparagus', 'Avocado', 'Citrus fruits'],
            icon: <Heart className="w-5 h-5 text-green-500" />
          },
          {
            name: 'Vitamin B6',
            amount: '1.9 mg',
            foodSources: ['Bananas', 'Chicken', 'Potatoes'],
            icon: <Apple className="w-5 h-5 text-yellow-500" />
          },
          {
            name: 'Ginger',
            amount: '1-2g daily',
            foodSources: ['Fresh ginger', 'Ginger tea', 'Ginger ale'],
            icon: <Coffee className="w-5 h-5 text-orange-500" />
          }
        ],
        dailyCalories: '1800-2000',
        hydration: '8-12 glasses',
        tips: ['Eat small, frequent meals', 'Focus on bland foods if nauseous', 'Stay hydrated with electrolytes']
      },
      '2nd Trimester': {
        title: 'Second Trimester Growth',
        description: 'Support rapid baby growth and increased energy needs',
        keyNutrients: [
          {
            name: 'Protein',
            amount: '70-100 g',
            foodSources: ['Lean meats', 'Eggs', 'Greek yogurt'],
            icon: <Fish className="w-5 h-5 text-purple-500" />
          },
          {
            name: 'DHA',
            amount: '200-300 mg',
            foodSources: ['Salmon', 'Walnuts', 'Chia seeds'],
            icon: <Fish className="w-5 h-5 text-blue-500" />
          },
          {
            name: 'Magnesium',
            amount: '350-400 mg',
            foodSources: ['Dark chocolate', 'Nuts', 'Whole grains'],
            icon: <Apple className="w-5 h-5 text-brown-500" />
          }
        ],
        dailyCalories: '2200-2500',
        hydration: '10-12 glasses',
        tips: ['Include protein at every meal', 'Eat omega-3 rich foods', 'Practice mindful eating']
      },
      '3rd Trimester': {
        title: 'Third Trimester Preparation',
        description: 'Final growth spurt and preparation for birth',
        keyNutrients: [
          {
            name: 'Iron',
            amount: '27 mg',
            foodSources: ['Red meat', 'Pumpkin seeds', 'Dark leafy greens'],
            icon: <Droplets className="w-5 h-5 text-red-500" />
          },
          {
            name: 'Calcium',
            amount: '1200-1300 mg',
            foodSources: ['Dairy', 'Sardines', 'Tofu'],
            icon: <Baby className="w-5 h-5 text-blue-500" />
          },
          {
            name: 'Vitamin K',
            amount: '90 mcg',
            foodSources: ['Kale', 'Broccoli', 'Brussels sprouts'],
            icon: <Apple className="w-5 h-5 text-green-500" />
          }
        ],
        dailyCalories: '2400-2800',
        hydration: '12-14 glasses',
        tips: ['Focus on iron-rich foods', 'Prepare freezer meals', 'Practice birth positions']
      },
      'Postpartum': {
        title: 'Postpartum Recovery',
        description: 'Support healing and breastfeeding nutrition',
        keyNutrients: [
          {
            name: 'Protein',
            amount: '80-100 g',
            foodSources: ['Lean meats', 'Legumes', 'Quinoa'],
            icon: <Fish className="w-5 h-5 text-purple-500" />
          },
          {
            name: 'Omega-3s',
            amount: '300-500 mg',
            foodSources: ['Salmon', 'Flaxseeds', 'Walnuts'],
            icon: <Fish className="w-5 h-5 text-blue-500" />
          },
          {
            name: 'Vitamin C',
            amount: '85-120 mg',
            foodSources: ['Bell peppers', 'Oranges', 'Strawberries'],
            icon: <Apple className="w-5 h-5 text-orange-500" />
          }
        ],
        dailyCalories: '2200-2500',
        hydration: '13-16 glasses',
        tips: ['Eat nutrient-dense snacks', 'Stay well-hydrated', 'Accept help with meal preparation']
      }
    };

    const plan = basePlans[stage as keyof typeof basePlans] || basePlans['Pre-pregnancy'];
    
    // Adjust for dietary preferences
    if (preference === 'Vegetarian' || preference === 'Vegan') {
      plan.keyNutrients = plan.keyNutrients.map(nutrient => ({
        ...nutrient,
        foodSources: nutrient.foodSources.map(source => {
          if (source.includes('meat') || source.includes('Red meat') || source.includes('Chicken')) {
            return preference === 'Vegan' ? 'Tofu/tempeh' : 'Dairy/eggs';
          }
          if (source.includes('fish') || source.includes('Salmon') || source.includes('Sardines')) {
            return preference === 'Vegan' ? 'Flaxseeds/walnuts' : 'Dairy/eggs';
          }
          return source;
        })
      }));
    }

    return plan;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stage || !formData.dietaryPreference) {
      return;
    }
    const plan = getNutritionPlan(formData.stage, formData.dietaryPreference);
    setNutritionPlan(plan);
    setShowResults(true);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-teal-100 to-purple-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-10 h-10 text-white" fill="currentColor" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif">
                Nourish Yourself, Nurture Your Baby
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Science-backed nutrition helps both mom and baby thrive. Get your personalized 
                diet plan based on your current stage and dietary preferences.
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-200 rounded-full opacity-20 -ml-24 -mb-24"></div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Intake Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
                  Personalize Your Nutrition Plan
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                      </label>
                      <Input
                        type="number"
                        placeholder="165"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <Input
                        type="number"
                        placeholder="65"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Stage
                    </label>
                    <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select your stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pre-pregnancy">Pre-pregnancy</SelectItem>
                        <SelectItem value="1st Trimester">1st Trimester</SelectItem>
                        <SelectItem value="2nd Trimester">2nd Trimester</SelectItem>
                        <SelectItem value="3rd Trimester">3rd Trimester</SelectItem>
                        <SelectItem value="Postpartum">Postpartum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Preference
                    </label>
                    <Select value={formData.dietaryPreference} onValueChange={(value) => handleInputChange('dietaryPreference', value)}>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-teal-400 focus:ring-teal-400">
                        <SelectValue placeholder="Select your preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Omnivore">Omnivore</SelectItem>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-xl py-4 text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Generate My Diet Plan
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {showResults && nutritionPlan && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">
                      {nutritionPlan.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{nutritionPlan.description}</p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-teal-50 rounded-xl p-4">
                        <p className="text-sm text-teal-600 font-medium">Daily Calories</p>
                        <p className="text-xl font-bold text-teal-700">{nutritionPlan.dailyCalories}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-sm text-purple-600 font-medium">Hydration</p>
                        <p className="text-xl font-bold text-purple-700">{nutritionPlan.hydration}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Key Nutrients</h4>
                      {nutritionPlan.keyNutrients.map((nutrient, index) => (
                        <div key={index} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            {nutrient.icon}
                            <div>
                              <h5 className="font-semibold text-gray-900">{nutrient.name}</h5>
                              <p className="text-sm text-gray-600">{nutrient.amount}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {nutrient.foodSources.map((source, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Expert Tips</h4>
                      <ul className="space-y-2">
                        {nutritionPlan.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DietPage;
