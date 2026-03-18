import { useState, useEffect } from 'react'

import './App.css'

const MasterFoodItem = ({ food, onAdd }) => {
  const [amount, setAmount] = useState(food.baseAmount);
  const liveCals = Math.round((food.calories / food.baseAmount) * amount);
  const liveProtein = Math.round((food.protein / food.baseAmount) * amount);

  return (
    <div className="master-item-card">
      {/* אזור ימין - שם וערכים צמודים לימין */}
      <div className="info-section">
        <div className="food-name-bold">{food.name}</div>
        <div className="food-stats-row">
          <span className="cals-color">{liveCals} קל'</span>
          <span className="protein-gray">{liveProtein} גרם חלבון</span>
        </div>
      </div>

      {/* אזור מרכז - תיבת גרמים וחיצים */}
      <div className="weight-control-section">
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(Number(e.target.value))} 
          className="weight-input"
          step="5"
        />
        <div className="weight-label">גרם</div>
      </div>

      {/* אזור שמאל - כפתור הוספה */}
      <div className="button-section">
        <button className="add-btn-circle" onClick={() => onAdd(food, amount)}>+</button>
      </div>
    </div>
  );
};

function App() {

  const [page, setPage] = useState(() => {
  // בודק אם שמרנו בעבר באיזה עמוד המשתמש היה
  return localStorage.getItem('currentPage') || 'setup';
});

// פונקציית עזר לקריאת נתונים מהזיכרון עם ערך ברירת מחדל
const getSaved = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  if (saved === null) return defaultValue;
  // בודק אם מדובר במספר או בטקסט (כמו מגדר)
  return isNaN(saved) ? saved : Number(saved);
};

// הגדרת States שמושכים נתונים מהזיכרון בטעינה ראשונה
const [gender, setGender] = useState(() => getSaved('user_gender', 'female'));
const [age, setAge] = useState(() => getSaved('user_age', 18));
const [weight, setWeight] = useState(() => getSaved('user_weight', 65));
const [height, setHeight] = useState(() => getSaved('user_height', 160));
const [activity, setActivity] = useState(() => getSaved('user_activity', 1.2));
const [tdee, setTdee] = useState(() => getSaved('user_tdee', 0));
const [proteinGoal, setProteinGoal] = useState(() => getSaved('user_proteinGoal', 0));
const [weeklyLoss, setWeeklyLoss] = useState(() => getSaved('user_weeklyLoss', 0.5));

// שמירה אוטומטית ל-localStorage בכל פעם שאחד הערכים משתנה
useEffect(() => {
  localStorage.setItem('user_gender', gender);
  localStorage.setItem('user_age', age);
  localStorage.setItem('user_weight', weight);
  localStorage.setItem('user_height', height);
  localStorage.setItem('user_activity', activity);
  localStorage.setItem('user_tdee', tdee);
  localStorage.setItem('user_proteinGoal', proteinGoal);
  localStorage.setItem('user_weeklyLoss', weeklyLoss);
}, [gender, age, weight, height, activity, tdee, proteinGoal, weeklyLoss]);

// חישוב אוטומטי בטעינת הדף אם כבר קיימים נתונים
useEffect(() => {
  if (weight > 0 && height > 0) {
    calc();
  }
}, []);

  const [meals, setMeals] = useState(() => {
  const saved = localStorage.getItem('myDailyMeals');
  return saved ? JSON.parse(saved) : [];
});

  const [consumedCalories, setConsumedCalories] = useState(0);

  const [consumedProtein, setConsumedProtein] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  localStorage.setItem('currentPage', page);
}, [page]);

  const [foodMaster, setFoodMaster] = useState(() => {
  const saved = localStorage.getItem('myFoodMaster');
  if (saved) {
    return JSON.parse(saved);
  }
  // אם אין כלום בזיכרון, נחזיר את רשימת ברירת המחדל
  return [
    { id: 1, name: "סינטה בקר", protein: 40, calories: 280, baseAmount: 220 }, // מחושב עבור 2 יחידות של 110 גרם
    { id: 2, name: "ירקות בתנור", protein: 3, calories: 43, baseAmount: 100 },
    
    // --- חלבי ---
    { id: 3, name: "אשל 4.5%", protein: 6, calories: 140, baseAmount: 200 }, // גביע
    { id: 4, name: "גיל 3%", protein: 6, calories: 112, baseAmount: 200 }, // גביע
    { id: 5, name: "צפתית 5%", protein: 6, calories: 58, baseAmount: 50 }, // רבע חבילה (לפי מנה של 60 גרם)
    { id: 6, name: "קוטג' 5%", protein: 2.5, calories: 21, baseAmount: 22 }, // כף סבירה
    { id: 7, name: "לאבנה 5%", protein: 1, calories: 7, baseAmount: 15 }, // כפית (לפי מנה של 15 גרם)
    
    // --- חלבון ---
    { id: 8, name: "קציצות עוף/חצי בקר (ברוטב עגבניות)", protein: 8, calories: 125, baseAmount: 85 }, // קציצה (לפי מנה של 85 גרם)
    { id: 9, name: "כתף בקר מעושנת", protein: 2.2, calories: 15, baseAmount: 7 }, // פרוסה (לפי פרוסה של 30 גרם)
    { id: 10, name: "ביצה במחבת", protein: 7, calories: 90, baseAmount: 60 }, // ביצה L
    { id: 11, name: "בולונז", protein: 24, calories: 285, baseAmount: 150 }, // מנה (לפי מנה של 150 גרם)
    { id: 12, name: "סלמון בתנור", protein: 38, calories: 300, baseAmount: 150 }, // יחידה (לפי מנה של 150 גרם)
    
    // --- סיבים ---
    { id: 13, name: "סלט עגבניות ובצל", protein: 2.5, calories: 65, baseAmount: 250 }, // קערה (לפי קערה של 250 גרם)
    { id: 14, name: "ירקות חתוכים טריים", protein: 1.5, calories: 45, baseAmount: 150 }, // מלפפון, עגבניות שרי, גמבה (לפי מנה של 150 גרם)
    { id: 15, name: "מטבוחה אחלה", protein: 0, calories: 16, baseAmount: 20 }, // כף סבירה
    
    // --- פחמימה ---
    { id: 16, name: "לחם אנג'ל", protein: 4.75, calories: 75, baseAmount: 35 }, // פרוסה (לפי פרוסה של 35 גרם)
    { id: 17, name: "תפוח אדמה בתנור", protein: 2, calories: 100, baseAmount: 100 }, // תוספת
    { id: 18, name: "אורז לבן/פטריות", protein: 2.5, calories: 150, baseAmount: 100 }, // תוספת
    { id: 19, name: "פירה", protein: 2, calories: 90, baseAmount: 100 }, // תוספת
    { id: 20, name: "פסטה", protein: 5, calories: 140, baseAmount: 100 }, // תוספת
    
    // --- פינוק ---
    { id: 21, name: "עוגת בננות", protein: 2, calories: 77, baseAmount: 50 }, // פרוסה (לפי פרוסה של 50 גרם)
    { id: 22, name: "קפה מעט חלב 3%", protein: 1.5, calories: 20, baseAmount: 240 }, // כוס (לפי כוס של 240 מ"ל)
    
    // --- פירות ---
    { id: 23, name: "תפוח", protein: 0, calories: 90, baseAmount: 100 }, // יחידה
    { id: 24, name: "בננה", protein: 1, calories: 100, baseAmount: 100 }, // יחידה
    { id: 25, name: "תות", protein: 0, calories: 5, baseAmount: 15 }, // תות בודד
    { id: 26, name: "תפוז", protein: 1, calories: 65, baseAmount: 150 }, // יחידה
    
    // --- שומנים ---
    { id: 27, name: "טחינה מעורבבת", protein: 1, calories: 30, baseAmount: 20 }, // כף גדושה (לפי מנה של 20 גרם)
    { id: 28, name: "אבוקדו", protein: 0.5, calories: 40, baseAmount: 50 }, // (לפי רבע אבוקדו בינוני)
    
    // --- תוסף חלבון ---
    { id: 29, name: "מעדן חלבון קפה אווירי", protein: 20, calories: 125, baseAmount: 200 }, // גביע (לפי מנה של 170 גרם)
    { id: 30, name: "משקה חלבון גו שוקולד", protein: 25, calories: 140, baseAmount: 340 }, // בקבוק (לפי כוס של 250 מ"ל)
  ];
});



  const [newFoodName, setNewFoodName] = useState('');

  const [newFoodCalories, setNewFoodCalories] = useState('');

  const [newFoodProtein, setNewFoodProtein] = useState('');

  const [newFoodAmount, setNewFoodAmount] = useState('');

  const [showAddFoodForm, setShowAddFoodForm] = useState(false);

  const [hasCalculated, setHasCalculated] = useState(false);



  const calc = () => {

    let bmr = (gender === 'female')

      ? (10 * weight) + (6.25 * height) - (5 * age) - 161

      : (10 * weight) + (6.25 * height) - (5 * age) + 5;



    let pMultiplier = 1;

    if (activity === 1.375) pMultiplier = 1.2;

    else if (activity === 1.55) pMultiplier = 1.5;

    else if (activity === 1.725) pMultiplier = 1.8;

   

    setProteinGoal(Math.round(weight * pMultiplier));

    setTdee(Math.round(bmr * activity));

    setHasCalculated(true);

  };



  useEffect(() => { if (hasCalculated) calc(); }, [gender, age, weight, height, activity]);

useEffect(() => {
  localStorage.setItem('myFoodMaster', JSON.stringify(foodMaster));
}, [foodMaster]);

  const targetCalories = tdee > 0 ? Math.round(tdee - (weeklyLoss * 1100)) : 0;

// שמירת ה-meals בכל שינוי
useEffect(() => {
  localStorage.setItem('myDailyMeals', JSON.stringify(meals));
  
  // עדכון אוטומטי של הקלוריות והחלבון שנצרכו על בסיס הרשימה השמורה
  const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProt = meals.reduce((sum, m) => sum + m.protein, 0);
  setConsumedCalories(totalCals);
  setConsumedProtein(totalProt);
}, [meals]);

  const addMealToLog = (food, amountToCalculate) => {

    const amountEaten = amountToCalculate || food.baseAmount;

    const ratio = amountEaten / food.baseAmount;

    const calculatedMeal = {

      name: `${food.name} (${Math.round(amountEaten)} גרם)`,

      calories: Math.round(food.calories * ratio),

      protein: Math.round(food.protein * ratio)

    };

    setMeals(prev => [...prev, calculatedMeal]);

    setConsumedCalories(prev => prev + calculatedMeal.calories);

    setConsumedProtein(prev => prev + calculatedMeal.protein);

    setShowAddFoodForm(false);

    setSearchTerm('');

  };



  const removeMeal = (indexToRemove) => {

    const meal = meals[indexToRemove];

    setMeals(prev => prev.filter((_, i) => i !== indexToRemove));

    setConsumedCalories(prev => Math.max(0, prev - meal.calories));

    setConsumedProtein(prev => Math.max(0, prev - meal.protein));

  };



  const addToMaster = () => {

    if (!newFoodName || !newFoodCalories || !newFoodProtein || !newFoodAmount) return;

    const newEntry = {

      id: Date.now(),

      name: newFoodName,

      calories: Math.round(Number(newFoodCalories)),

      protein: Math.round(Number(newFoodProtein)),

      baseAmount: Math.round(Number(newFoodAmount))

    };

    setFoodMaster(prev => [...prev, newEntry]);

    setNewFoodName(''); setNewFoodCalories(''); setNewFoodProtein(''); setNewFoodAmount('');

  };



  const filteredFoodMaster = foodMaster.filter(f =>

    f.name.toLowerCase().includes(searchTerm.toLowerCase())

  );



  return (

    <div className='app-container'>

      {page === 'setup' ? (

        <div className="setup-view">

          <h1 className="main-title">מחשבון צריכת<br/>קלוריות יומית</h1>

          <div className="card">

            <div className='input-group'><label>מין</label><select value={gender} onChange={(e) => setGender(e.target.value)}><option value="female">נקבה</option><option value="male">זכר</option></select></div>

            <div className='input-group'><label>גיל</label><input type='number' value={Math.round(age)} onChange={(e) => setAge(Number(e.target.value))} /></div>

            <div className='input-group'><label>משקל (ק"ג)</label><input type='number' value={Math.round(weight)} onChange={(e) => setWeight(Number(e.target.value))} /></div>

            <div className='input-group'><label>גובה (ס"מ)</label><input type='number' value={Math.round(height)} onChange={(e) => setHeight(Number(e.target.value))} /></div>

            <div className='input-group'><label>רמת פעילות</label><select value={activity} onChange={(e) => setActivity(Number(e.target.value))}><option value={1.2}>לא פעיל (משרדי)</option><option value={1.375}>פעילות קלה (1-3 אימונים)</option><option value={1.55}>פעילות בינונית (3-5 אימונים)</option><option value={1.725}>פעילות גבוהה (אימון יומיומי)</option></select></div>

            <div className="input-group"><label>יעד ירידה בשבוע</label><select value={weeklyLoss} onChange={(e) => setWeeklyLoss(Number(e.target.value))}><option value={0}>תחזוקה</option><option value={0.25}>0.25 ק"ג</option><option value={0.5}>0.5 ק"ג</option><option value={0.75}>0.75 ק"ג</option></select></div>

            <button className="primary-btn" onClick={calc}>חשב תוצאות</button>

          </div>

          {hasCalculated && (

            <div className='results-preview'>

              <p>תחזוקה: <span>{Math.round(tdee)}</span></p>

              <p>יעד ירידה: <span>{Math.round(targetCalories)}</span></p>

              <p>יעד חלבון: <span>{Math.round(proteinGoal)} גרם</span></p>

              <button className="primary-btn" style={{background: '#10b981', marginTop: '15px'}} onClick={() => setPage('dashboard')}>המשך למעקב היומי ←</button>

            </div>

          )}

        </div>

      ) : (

        <div className="dashboard-view">

          <div className="dashboard-header"><h2 className="section-title">היום שלי</h2><button className="settings-btn" onClick={() => setPage('setup')}>⚙️</button></div>

          <div className="summary-card">

            <div className="stat-box"><span className="stat-value">{Math.round(targetCalories - consumedCalories)}</span><span className="stat-label">נותרו</span></div>

            <div className="divider"></div>

            <div className="stat-box"><span className="stat-value">{Math.round(consumedProtein)}/{Math.round(proteinGoal)}</span><span className="stat-label">חלבון</span></div>

          </div>

          <h3 className="meals-header">ארוחות</h3>

          <div className="meal-list">
  {meals.map((meal, index) => (
    <div key={index} className="meal-item">
      <button className="remove-meal-btn" onClick={() => removeMeal(index)}>✕</button>
      <div className="meal-info-right">
        <span className="meal-name">{meal.name}</span>
        <div className="meal-stats">
          <span>{Math.round(meal.calories)} קל'</span>
          <span>{Math.round(meal.protein)} גרם חלבון</span>
        </div>
      </div>
    </div>
  ))}
</div>

          <button className="fab" onClick={() => setShowAddFoodForm(true)}>+</button>

          {showAddFoodForm && (

            <div className="modal-overlay" onClick={() => setShowAddFoodForm(false)}>

              <div className="modal-content" onClick={e => e.stopPropagation()}>

                <h3 className="modal-title">המאסטר שלי</h3>

                <input type="text" className="search-bar" placeholder="חיפוש מאכל..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                <div className="food-grid">

                  {filteredFoodMaster.map(food => (

                    <MasterFoodItem key={food.id} food={food} onAdd={addMealToLog} />

                  ))}

                </div>

                <div className="master-add-section">

                  <p className="add-food-label centered">הוספת מאכל חדש למאגר:</p>

                  <input className="modal-input-full centered-input" placeholder="שם המאכל" value={newFoodName} onChange={e => setNewFoodName(e.target.value)} />

                  <div className="compact-input-row">

                    <input className="centered-input" placeholder="קלוריות" type="number" value={newFoodCalories} onChange={e => setNewFoodCalories(e.target.value)} />

                    <input className="centered-input" placeholder="חלבון" type="number" value={newFoodProtein} onChange={e => setNewFoodProtein(e.target.value)} />

                    <input className="centered-input" placeholder="משקל" type="number" value={newFoodAmount} onChange={e => setNewFoodAmount(e.target.value)} />

                  </div>

                  <button className="primary-btn" onClick={addToMaster}>שמור במאגר</button>

                </div>

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );

}



export default App;

