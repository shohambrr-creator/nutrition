
import { useState, useEffect } from 'react'
import './App.css'

// רכיב פריט מזון במאסטר
const MasterFoodItem = ({ food, onAdd }) => {
  const [amount, setAmount] = useState(food.baseAmount);
  const liveCals = Math.round((food.calories / food.baseAmount) * amount);
  const liveProtein = Math.round((food.protein / food.baseAmount) * amount);

  const handleIncrement = () => {
    setAmount(prev => Number(prev) + 1);
  };

  const handleDecrement = () => {
    setAmount(prev => (prev > 1 ? Number(prev) - 1 : 1));
  };

  return (
    <div className="master-item-card">
      <div className="info-section">
        <div className="food-name-bold">{food.name}</div>
        <div className="food-stats-row">
          <span className="cals-color">{liveCals} קל'</span>
          <span className="protein-gray">{liveProtein} גרם חלבון</span>
        </div>
      </div>
      <div className="controls-wrapper">
        <div className="weight-control-section">
          <div className="weight-input-container">
            <div className="arrows-container">
              {/* תיקון כאן: הורדת הסוגריים המסולסלים המיותרים */}
              <button className="arrow-btn up" onClick={handleIncrement}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                  <path d="M2 15l10 -5 10 5" />
                </svg>
              </button>
            </div>

            <div className='weight-number'>
              <input 
                type="number" 
                value={amount}
                className="weight-input-clean" 
                step={1}
                min={1}
                // וודאי שה-onChange קיים ומעודכן
                onChange={(e) => setAmount(Number(e.target.value))}
              /> 
            </div>
            
            <div className="arrows-container">
              {/* תיקון כאן: הורדת הסוגריים המסולסלים המיותרים */}
              <button className="arrow-btn down" onClick={handleDecrement}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                  <path d="M2 9l10 5 10 -5" />
                </svg>
              </button>
            </div>
          </div>
          <div className="weight-label">גרם</div>
        </div>
        <div className="button-section">
          {/* כאן ה-amount תמיד יהיה מעודכן למה שמופיע בתיבה */}
          <button className="add-btn-circle" onClick={() => onAdd(food, amount)}>+</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [page, setPage] = useState(() => localStorage.getItem('currentPage') || 'setup');

  const getSaved = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved === null || saved === "undefined" || saved === "null") return defaultValue;
    return isNaN(saved) ? saved : Number(saved);
  };

  // נתונים בסיסיים
  const [gender, setGender] = useState(() => getSaved('user_gender', 'female'));
  const [age, setAge] = useState(() => getSaved('user_age', 18));
  const [weight, setWeight] = useState(() => getSaved('user_weight', 65));
  const [height, setHeight] = useState(() => getSaved('user_height', 160));
  const [activity, setActivity] = useState(() => getSaved('user_activity', 1.2));
  const [weeklyLoss, setWeeklyLoss] = useState(() => getSaved('user_weeklyLoss', 0.5));
  
  // התאמה אישית
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTarget, setCustomTarget] = useState(() => getSaved('user_customTarget', null));
  const [customProtein, setCustomProtein] = useState(() => getSaved('user_customProtein', null));

  // ארוחות יומיות
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('myDailyMeals');
    return saved ? JSON.parse(saved) : [];
  });

  // מאגר מאכלים (Master)
  const [foodMaster, setFoodMaster] = useState(() => {
    const saved = localStorage.getItem('myFoodMaster');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "סינטה בקר", protein: 40, calories: 280, baseAmount: 163 },
  { id: 2, name: "ירקות בתנור", protein: 6, calories: 85, baseAmount: 200 },
  { id: 3, name: "אשל 4.5%", protein: 6, calories: 140, baseAmount: 200 },
  { id: 4, name: "גיל 3%", protein: 6, calories: 112, baseAmount: 200 },
  { id: 5, name: "צפתית 5%", protein: 6, calories: 58, baseAmount: 50 },
  { id: 6, name: "קוטג' 5%", protein: 2.5, calories: 21, baseAmount: 22 },
  { id: 7, name: "לאבנה 5%", protein: 1, calories: 7, baseAmount: 15 },
  { id: 8, name: "קציצות עוף/בקר", protein: 8, calories: 125, baseAmount: 85 },
  { id: 9, name: "כתף בקר מעושנת", protein: 2.2, calories: 15, baseAmount: 7 },
  { id: 10, name: "ביצה במחבת", protein: 7, calories: 90, baseAmount: 60 },
  { id: 11, name: "בולונז", protein: 24, calories: 285, baseAmount: 150 },
  { id: 12, name: "סלמון בתנור", protein: 38, calories: 300, baseAmount: 150 },
  { id: 13, name: "סלט עגבניות ובצל", protein: 2.5, calories: 65, baseAmount: 250 },
  { id: 14, name: "ירקות טריים", protein: 1.5, calories: 45, baseAmount: 150 },
  { id: 15, name: "מטבוחה אחלה", protein: 0, calories: 16, baseAmount: 20 },
  { id: 16, name: "לחם אנג'ל", protein: 4.75, calories: 75, baseAmount: 35 },
  { id: 17, name: "תפוח אדמה בתנור", protein: 2, calories: 100, baseAmount: 100 },
  { id: 18, name: "אורז לבן", protein: 2.5, calories: 150, baseAmount: 100 },
  { id: 19, name: "פתיתים", protein: 5, calories: 160, baseAmount: 100 }, 
  { id: 20, name: "פירה", protein: 2, calories: 90, baseAmount: 100 },
  { id: 21, name: "פסטה", protein: 5, calories: 140, baseAmount: 100 },
  { id: 22, name: "עוגת בננות", protein: 2, calories: 77, baseAmount: 50 },
  { id: 23, name: "קפה מעט חלב", protein: 1.5, calories: 20, baseAmount: 240 },
  { id: 24, name: "תפוח", protein: 0, calories: 90, baseAmount: 150 },
  { id: 25, name: "בננה", protein: 1, calories: 100, baseAmount: 100 },
  { id: 26, name: "תות", protein: 0, calories: 5, baseAmount: 15 },
  { id: 27, name: "תפוז", protein: 1, calories: 65, baseAmount: 150 },
  { id: 28, name: "טחינה", protein: 1, calories: 30, baseAmount: 20 },
  { id: 29, name: "אבוקדו", protein: 0.5, calories: 40, baseAmount: 50 },
  { id: 30, name: "מעדן חלבון", protein: 20, calories: 125, baseAmount: 200 },
  { id: 31, name: "משקה חלבון", protein: 25, calories: 140, baseAmount: 340 }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', defaultWeight: '' });
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);

  // --- חישובים אוטומטיים (לפי נתוני משתמש) ---
  const bmr = (gender === 'female')
    ? (10 * weight) + (6.25 * height) - (5 * age) - 161
    : (10 * weight) + (6.25 * height) - (5 * age) + 5;

  const tdee = Math.round(bmr * activity);
  const autoTargetCals = weeklyLoss === 0 ? tdee : Math.round(tdee - (weeklyLoss * 1100));
  
  let pMultiplier = 1;
  if (activity === 1.375) pMultiplier = 1.2;
  else if (activity === 1.55) pMultiplier = 1.5;
  else if (activity === 1.725) pMultiplier = 1.8;
  const autoProteinGoal = Math.round(weight * pMultiplier);

  // קביעת הערכים הסופיים: עדיפות ל-Custom, ואם הוא null/0 משתמשים ב-Auto
  const finalTargetCals = (customTarget && customTarget !== 0) ? customTarget : autoTargetCals;
  const finalProteinGoal = (customProtein && customProtein !== 0) ? customProtein : autoProteinGoal;

  useEffect(() => {
    localStorage.setItem('currentPage', page);
    localStorage.setItem('user_gender', gender);
    localStorage.setItem('user_age', age);
    localStorage.setItem('user_weight', weight);
    localStorage.setItem('user_height', height);
    localStorage.setItem('user_activity', activity);
    localStorage.setItem('user_weeklyLoss', weeklyLoss);
    localStorage.setItem('user_customTarget', customTarget);
    localStorage.setItem('user_customProtein', customProtein);
    localStorage.setItem('myFoodMaster', JSON.stringify(foodMaster));
    localStorage.setItem('myDailyMeals', JSON.stringify(meals));
  }, [page, gender, age, weight, height, activity, weeklyLoss, foodMaster, meals, customTarget, customProtein]);

  useEffect(() => {
  if (!showAddFoodForm) {
    // איפוס החיפוש
    setSearchTerm('');
    
    // איפוס הטופס לערכי ברירת מחדל
    setNewFood({
      name: '',
      calories: '',
      protein: '',
      defaultWeight: ''
    });
  }
}, [showAddFoodForm]);

  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = meals.reduce((sum, m) => sum + m.protein, 0);

  const addMealToLog = (food, amountToCalculate) => {
    const amountEaten = amountToCalculate || food.baseAmount;
    const ratio = amountEaten / food.baseAmount;
    setMeals(prev => [...prev, {
      name: `${food.name} (${Math.round(amountEaten)} גרם)`,
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio)
    }]);
    setShowAddFoodForm(false);
    setSearchTerm('');
  };

  const removeMeal = (indexToRemove) => {
    setMeals(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const addToMaster = () => {
    if (!newFood.name || !newFood.calories || !newFood.protein || !newFood.defaultWeight) return;
    setFoodMaster(prev => [...prev, {
      id: Date.now(),
      name: newFood.name,
      calories: Math.round(Number(newFood.calories)),
      protein: Math.round(Number(newFood.protein)),
      baseAmount: Math.round(Number(newFood.defaultWeight))
    }]);
    setNewFood({ name: '', calories: '', protein: '', defaultWeight: '' });
  };

  return (
    <div className='app-container'>
      {page === 'setup' ? (
        <div className="setup-view">
          <h1 className="main-title">מחשבון צריכת<br/>קלוריות יומית</h1>
          <div className="card"><div className='input-group has-select'>
    <label>מין</label>
    <select value={gender} onChange={(e) => setGender(e.target.value)}>
      <option value="female">נקבה</option>
      <option value="male">זכר</option>
    </select>
  </div>

  {/* גיל */}
  <div className='input-group'>
    <label>גיל</label>
    <div className="setup-number-control">
      <button onClick={() => setAge(prev => (prev > 1 ? prev - 1 : 1))}>-</button>
      <input type='number' value={age} onChange={(e) => setAge(Number(e.target.value))} />
      <button onClick={() => setAge(prev => prev + 1)}>+</button>
    </div>
  </div>

  {/* משקל */}
  <div className='input-group'>
    <label>משקל (ק"ג)</label>
    <div className="setup-number-control">
      <button onClick={() => setWeight(prev => (prev > 0.5 ? prev - 0.5 : 0.5))}>-</button>
      <input type='number' value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
      <button onClick={() => setWeight(prev => prev + 1)}>+</button>
    </div>
  </div>

  {/* גובה */}
  <div className='input-group'>
    <label>גובה (ס"מ)</label>
    <div className="setup-number-control">
      <button onClick={() => setHeight(prev => (prev > 1 ? prev - 1 : 1))}>-</button>
      <input type='number' value={height} onChange={(e) => setHeight(Number(e.target.value))} />
      <button onClick={() => setHeight(prev => prev + 1)}>+</button>
    </div>
  </div>

  {/* רמת פעילות - עם חץ מצויר */}
  <div className='input-group has-select'>
    <label>רמת פעילות</label>
    <select value={activity} onChange={(e) => setActivity(Number(e.target.value))}>
      <option value={1.2}>לא פעיל (משרדי)</option>
      <option value={1.375}>פעילות קלה (1-3 אימונים)</option>
      <option value={1.55}>פעילות בינונית (3-5 אימונים)</option>
      <option value={1.725}>פעילות גבוהה (אימון יומיומי)</option>
    </select>
  </div>

  {/* יעד שבועי - עם חץ מצויר */}
  <div className="input-group has-select">
    <label>יעד שבועי</label>
    <select value={weeklyLoss} onChange={(e) => setWeeklyLoss(Number(e.target.value))}>
      <option value={0}>תחזוקה (ללא ירידה)</option>
      <option value={0.25}>ירידה של 0.25 ק"ג</option>
      <option value={0.5}>ירידה של 0.5 ק"ג</option>
      <option value={0.75}>ירידה של 0.75 ק"ג</option>
    </select>
  </div>  </div>
          
          <div className="live-results-container">
    {/* כרטיס יעד עיקרי - כחול */}
    <div className="result-card main-target">
        <div className="result-text-group">
            <span className="result-label">
                {weeklyLoss === 0 ? "יעד קלורי לתחזוקה" : "יעד קלורי לירידה"}
            </span>
            <strong className="result-number">
                {finalTargetCals} <span className="unit">קל'</span>
            </strong>
        </div>
    </div>

    {/* כרטיס TDEE - סגול (מוצג רק אם יש יעד ירידה) */}
    {weeklyLoss !== 0 && (
        <div className="result-card maintenance">
            <div className="result-text-group">
                <span className="result-label">צריכת תחזוקה (TDEE)</span>
                <strong className="result-number">
                    {tdee} <span className="unit">קל'</span>
                </strong>
            </div>
        </div>
    )}
   {/* כרטיס חלבון - ירוק */}
    <div className="result-card protein">
        <div className="result-text-group">
            <span className="result-label">יעד חלבון יומי</span>
            <strong className="result-number">
                {finalProteinGoal} <span className="unit">גרם</span>
            </strong>
        </div>
    </div>
</div>

          

            <div className="setup-actions-group">
    {/* כפתור כניסה למודאל - תמיד מופיע */}
    <button className="secondary-action-btn edit-btn" onClick={() => setShowCustomModal(true)}>
      ⚙️ הגדר ידנית
    </button>
    
    {/* כפתור הריסט - יופיע אך ורק אם הוזן ערך ידני (כלומר הוא לא null) */}
    {((customTarget !== null && customTarget !== autoTargetCals) || 
      (customProtein !== null && customProtein !== autoProteinGoal)) && (
        <button 
          className="secondary-action-btn reset-btn" 
          onClick={() => { 
            setCustomTarget(null); 
            setCustomProtein(null); 
          }}
          title="חזור לחישוב אוטומטי"
        >
          🔄 איפוס
        </button>
    )}
</div>
            <button className="primary-btn dashboard-link animated-btn" onClick={() => setPage('dashboard')}>
              המשך למעקב היומי <span className="arrow-icon">←</span>
            </button>
          
        </div>
      ) : (
        <div className="dashboard-view">
          <div className="dashboard-header">
            <h2 className="section-title">היום שלי</h2>
            <button className="settings-btn" onClick={() => setPage('setup')}>⚙️</button>
          </div>
          <div className="summary-card">
            <div className="stat-box">
              <span className="stat-value">{finalTargetCals - consumedCalories}</span>
              <span className="stat-label">נותרו</span>
            </div>
            <div className="divider"></div>
            <div className="stat-box">
              <span className="stat-value">{consumedProtein}/{finalProteinGoal}</span>
              <span className="stat-label">חלבון</span>
            </div>
          </div>
          
          <h3 className="meals-header">ארוחות</h3>
          <div className="meal-list">
            {meals.length === 0 ? (
              <p style={{textAlign:'center', color:'#999', marginTop:'20px'}}>טרם הוספת ארוחות היום</p>
            ) : (
              meals.map((meal, index) => (
                <div key={index} className="meal-item">
                  <button className="remove-meal-btn" onClick={() => removeMeal(index)}>✕</button>
                  <div className="meal-info">
                    <span className="meal-name-row">{meal.name}</span>
                    <div className="meal-stats-row">
                      <span className="cals-color">{meal.calories} קל'</span>
                      <span className="protein-gray">{meal.protein} גרם חלבון</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="fab" onClick={() => setShowAddFoodForm(true)}>+</button>
        </div>
      )}

      {/* מודל התאמה אישית של היעדים */}
      {showCustomModal && (
  <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      
      {/* סעיף 4: כותרת בעיצוב של המאסטר */}
      <h3 className="modal-title">התאמה אישית</h3>
      
      <div className="custom-setup-container">
        {/* סעיף 5: תוויות בעיצוב של שמות המאכלים */}
        <div className="custom-input-wrapper">
  <label className="food-name-bold">יעד קלוריות</label>
  <input 
    type="number" 
    /* אם customTarget הוא null, אנחנו מציגים את autoTargetCals כערך התחלתי */
    value={customTarget !== null ? customTarget : autoTargetCals} 
    className="setup-style-input" 
    onChange={(e) => setCustomTarget(Number(e.target.value))}
  />
</div>

<div className="custom-input-wrapper">
  <label className="food-name-bold">יעד חלבון (גרם)</label>
  <input 
    type="number" 
    /* אותו דבר כאן - הערך המוצג הוא או המותאם או האוטומטי */
    value={customProtein !== null ? customProtein : autoProteinGoal} 
    className="setup-style-input"
    onChange={(e) => setCustomProtein(Number(e.target.value))}
  />
</div>

        <div className="modal-actions-row">
          <button className="save-btn" onClick={() => setShowCustomModal(false)}>אישור</button>
          
          {/* סעיף 3: כפתור ריפרש במקום טקסט חזרה לאוטומטי */}
          <button 
            className="refresh-circle-btn" 
            onClick={() => { setCustomTarget(null); setCustomProtein(null); }}
            title="חזרה לחישוב אוטומטי"
          >
            🔄
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {showAddFoodForm && (
  <div className="modal-overlay" onClick={() => setShowAddFoodForm(false)}>
    <div className="modal-content master-modal" onClick={e => e.stopPropagation()}>
      <h3 className="modal-title">המאכלים שלי</h3>
      
      {/* שדה חיפוש */}
      <input 
        type="text" 
        className="search-input" 
        placeholder="חיפוש מאכל..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      <div className="products-list-container" style={{ height: '240px', minHeight: '240px' }}>
    {foodMaster.filter(f => f.name.includes(searchTerm)).length > 0 ? (
      foodMaster
        .filter(f => f.name.includes(searchTerm))
        .map(food => (
          <MasterFoodItem key={food.id} food={food} onAdd={addMealToLog} />
        ))
    ) : (
      <div className="no-results-wrapper">
        <p className="no-results">לא נמצאו מאכלים...</p>
      </div>
    )}
  </div>

      {/* טופס הוספה שנשאר תמיד למטה */}
      <div className="new-food-form">
        <h3>הוספת מאכל חדש למאגר</h3>
        <div className="form-grid">
          <input className="full-width" placeholder="שם המאכל" value={newFood.name} onChange={(e) => setNewFood({...newFood, name: e.target.value})} />
          <input type="number" placeholder="קלוריות" value={newFood.calories} onChange={(e) => setNewFood({...newFood, calories: e.target.value})} />
          <input type="number" placeholder="חלבון" value={newFood.protein} onChange={(e) => setNewFood({...newFood, protein: e.target.value})} />
          <input type="number" placeholder="משקל (גרם)" className="full-width" value={newFood.defaultWeight} onChange={(e) => setNewFood({...newFood, defaultWeight: e.target.value})} />
        </div>
        <button className="save-btn" onClick={addToMaster}>שמור במאגר</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;