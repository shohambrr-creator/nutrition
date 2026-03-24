
import { useState, useEffect } from 'react'
import './App.css'

// רכיב פריט מזון במאסטר
const MasterFoodItem = ({ food, onAdd, ShowRemoveProductFromMaster, removeProductFromMaster }) => {
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
      {ShowRemoveProductFromMaster && (<button className="remove-meal-btn" onClick={() => removeProductFromMaster(food.id)}>✕</button>)}
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
          <button className="add-btn-circle" onClick={() => onAdd(food, amount)}>+</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showRemoveProductFromMaster, setShowRemoveProductFromMaster] = useState(false);
  const [page, setPage] = useState(() => localStorage.getItem('currentPage') || 'setup');
  const [apiResults, setApiResults] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);


  const getSaved = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved === null || saved === "undefined" || saved === "null") return defaultValue;
    return isNaN(saved) ? saved : Number(saved);
  };

  // נתונים בסיסיים
  const [gender, setGender] = useState(() => getSaved('user_gender', 'female'));
  const [age, setAge] = useState(() => getSaved('user_age', 22));
  const [weight, setWeight] = useState(() => getSaved('user_weight', 64));
  const [height, setHeight] = useState(() => getSaved('user_height', 160));
  const [activity, setActivity] = useState(() => getSaved('user_activity', 1.375));
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
      // --- בשר, דגים וביצים (1-7) ---
      { id: 1, name: "סינטה בקר", protein: 40, calories: 280, baseAmount: 163 },
      { id: 2, name: "סינטה (אחרי בישול)", protein: 36, calories: 280, baseAmount: 120 },
      { id: 3, name: "קציצות עוף/בקר", protein: 8, calories: 125, baseAmount: 85 },
      { id: 4, name: "כתף בקר מעושנת", protein: 2.2, calories: 15, baseAmount: 7 },
      { id: 5, name: "בולונז", protein: 24, calories: 285, baseAmount: 150 },
      { id: 6, name: "סלמון בתנור", protein: 25, calories: 210, baseAmount: 100 },
      { id: 7, name: "ביצה במחבת", protein: 7, calories: 90, baseAmount: 60 },

      // --- גבינות ומוצרי חלב (8-15) ---
      { id: 8, name: "אשל 4.5%", protein: 6, calories: 140, baseAmount: 200 },
      { id: 9, name: "גיל 3%", protein: 6, calories: 112, baseAmount: 200 },
      { id: 10, name: "צפתית 5%", protein: 6, calories: 58, baseAmount: 50 },
      { id: 11, name: "קוטג' 5%", protein: 2.5, calories: 21, baseAmount: 22 },
      { id: 12, name: "לאבנה 5%", protein: 1, calories: 7, baseAmount: 15 },
      { id: 13, name: "שמנת זיתים 5%", protein: 8, calories: 104, baseAmount: 100 },
      { id: 14, name: "מעדן חלבון", protein: 20, calories: 125, baseAmount: 200 },
      { id: 15, name: "משקה חלבון", protein: 25, calories: 140, baseAmount: 340 },

      // --- ירקות, סלטים ושומנים (16-23) ---
      { id: 16, name: "ירקות בתנור", protein: 6, calories: 85, baseAmount: 200 },
      { id: 17, name: "סלט עגבניות ובצל", protein: 2.5, calories: 65, baseAmount: 250 },
      { id: 18, name: "ירקות טריים", protein: 1.5, calories: 45, baseAmount: 150 },
      { id: 19, name: "מטבוחה אחלה", protein: 0, calories: 16, baseAmount: 20 },
      { id: 20, name: "סלט חציל - כבד", protein: 1, calories: 31, baseAmount: 15 },
      { id: 21, name: "חומוס", protein: 8, calories: 300, baseAmount: 100 },
      { id: 22, name: "טחינה", protein: 1, calories: 30, baseAmount: 20 },
      { id: 23, name: "אבוקדו", protein: 0.5, calories: 40, baseAmount: 50 },

      // --- תוספות ופחמימות (24-30) ---
      { id: 24, name: "לחם אנג'ל", protein: 4.75, calories: 75, baseAmount: 35 },
      { id: 25, name: "תפוח אדמה בתנור", protein: 2, calories: 100, baseAmount: 100 },
      { id: 26, name: "אורז לבן", protein: 2.5, calories: 150, baseAmount: 100 },
      { id: 27, name: "פתיתים", protein: 5, calories: 160, baseAmount: 100 },
      { id: 28, name: "פירה", protein: 2, calories: 90, baseAmount: 100 },
      { id: 29, name: "פסטה", protein: 5, calories: 140, baseAmount: 100 },
      { id: 30, name: "עדשים מבושלות", protein: 9, calories: 120, baseAmount: 100 },

      // --- פירות ומתוקים (31-37) ---
      { id: 31, name: "תפוח", protein: 0, calories: 90, baseAmount: 150 },
      { id: 32, name: "בננה", protein: 1, calories: 100, baseAmount: 100 },
      { id: 33, name: "תות", protein: 0, calories: 5, baseAmount: 15 },
      { id: 34, name: "תפוז", protein: 1, calories: 65, baseAmount: 150 },
      { id: 35, name: "עוגת בננות", protein: 2, calories: 77, baseAmount: 50 },
      { id: 36, name: "עוגת שוקו קפה", protein: 5, calories: 80, baseAmount: 48 },
      { id: 37, name: "קפה מעט חלב", protein: 1.5, calories: 20, baseAmount: 240 }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [newFood, setNewFood] = useState({ name: '', calories: 0, protein: 0, defaultWeight: 0 });
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  useEffect(() => {
    // אם אין טקסט בחיפוש, מנקים את התוצאות
    if (!searchTerm.trim()) {
      setApiResults([]);
      return;
    }

    // מסננים רק את הרשימה שקיימת אצלך בקוד
    const filtered = foodMaster.filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setApiResults(filtered);
  }, [searchTerm, foodMaster]);

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
    const dataToSave = {
      currentPage: page,
      user_gender: gender,
      user_age: age,
      user_weight: weight,
      user_height: height,
      user_activity: activity,
      user_weeklyLoss: weeklyLoss,
      user_customTarget: customTarget,
      user_customProtein: customProtein,
      myFoodMaster: JSON.stringify(foodMaster),
      myDailyMeals: JSON.stringify(meals)
    };

    Object.entries(dataToSave).forEach(([key, value]) => {
      localStorage.setItem(key, typeof value === 'string' ? value : String(value));
    });
  }, [page, gender, age, weight, height, activity, weeklyLoss, foodMaster, meals, customTarget, customProtein]);
  useEffect(() => {
    // אם מודל רשימת המאכלים נסגר
    if (!showAddFoodForm) {
      setSearchTerm('');
    }

    // אם מודל הוספת מאכל חדש נסגר
    if (!showAddFoodModal) {
      setNewFood({
        name: '',
        calories: '',
        protein: '',
        defaultWeight: ''
      });
    }
  }, [showAddFoodForm, showAddFoodModal]);
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
  };

  const removeMeal = (indexToRemove) => {
    setMeals(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const removeProductFromMaster = (indexToRemove) => {
    setFoodMaster(prev => prev.filter(food => food.id !== indexToRemove));

  }
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
    setShowAddFoodModal(false);
  };

  return (
    <div className='app-container'>
      {page === 'setup' ? (
        <div className="setup-view">
          <h1 className="main-title">מחשבון צריכת<br />קלוריות יומית</h1>
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
                <button onClick={() => setWeight(prev => (prev > 1 ? prev - 1 : 1))}>-</button>
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
              <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>טרם הוספת ארוחות היום</p>
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
        <div className="modal-overlay">
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            {/* סעיף 4: כותרת בעיצוב של המאסטר */}
            <div className='modal-header'>
              <h3 className="modal-title">התאמה אישית</h3>
              <button className="close-x" onClick={() => setShowCustomModal(false)}>×</button>
            </div>
            <div className="custom-setup-container">
              {/* סעיף 5: תוויות בעיצוב של שמות המאכלים */}
              <div className="input-group">
                <label>יעד קלוריות</label>
                <div className='setup-number-control'>
                  {/* כפתור מינוס */}
                  <button onClick={() =>
                    setCustomTarget(prev => {
                      const startVal = prev !== null ? prev : autoTargetCals;
                      return startVal > 1 ? startVal - 1 : 1;
                    })
                  }>-</button>

                  <input
                    type="number"
                    value={customTarget !== null ? customTarget : autoTargetCals}
                    onChange={(e) => setCustomTarget(Number(e.target.value))}
                  />

                  {/* כפתור פלוס */}
                  <button onClick={() =>
                    setCustomTarget(prev => (prev !== null ? prev : autoTargetCals) + 1)
                  }>+</button> </div>
              </div>

              <div className="input-group">
                <label>יעד חלבון (גרם)</label>
                <div className='setup-number-control'>
                  {/* כפתור מינוס */}
                  <button onClick={() =>
                    setCustomProtein(prev => {
                      const startVal = prev !== null ? prev : autoProteinGoal;
                      return startVal > 1 ? startVal - 1 : 1;
                    })
                  }>-</button>

                  <input
                    type="number"
                    value={customProtein !== null ? customProtein : autoProteinGoal}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                  />

                  {/* כפתור פלוס */}
                  <button onClick={() =>
                    setCustomProtein(prev => (prev !== null ? prev : autoProteinGoal) + 1)
                  }>+</button> </div>
              </div>

              <div className="modal-actions-row">
                <button className="save-add-btn" onClick={() => setShowCustomModal(false)}>אישור</button>

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
        <div className="modal-overlay">
          <div className="modal-content master-modal" onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <h3 className="modal-title">המאכלים שלי</h3>
              <button className="close-x" onClick={() => setShowAddFoodForm(false)}>×</button>
            </div>
            {/* שדה חיפוש */}
            <div className="search-input">
              <input
                type="text"

                placeholder="חיפוש מאכל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              /> </div>

            <div className="products-list-container" style={{ height: '240px', overflowY: 'auto' }}>
              {foodMaster
                .filter(f => f.name.includes(searchTerm))
                .map(food => (
                  <MasterFoodItem
                    key={food.id}
                    food={food}
                    onAdd={addMealToLog}
                    ShowRemoveProductFromMaster={showRemoveProductFromMaster}
                    removeProductFromMaster={removeProductFromMaster}
                  />
                ))
              }

              {searchTerm && foodMaster.filter(f => f.name.includes(searchTerm)).length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
                  המוצר לא קיים ברשימה
                </p>
              )}
            </div>


            <div className='seperate-line'></div>
            <div className='remove-add-btns'>
              {!showRemoveProductFromMaster && (
                <button className='save-add-btn'

                  onClick={() => setShowAddFoodModal(true)}
                >
                  הוספת מאכל</button>
              )}

              {!showRemoveProductFromMaster && (<button className='save-add-btn'

                onClick={() => setShowRemoveProductFromMaster(true)}
              >
                מחיקת מאכל</button>)
              }

              {showRemoveProductFromMaster && (<button className='save-add-btn'

                onClick={() => setShowRemoveProductFromMaster(false)}
              >
                סיום עריכה</button>)}
            </div>
            {/* טופס הוספה שנשאר תמיד למטה */}
            {showAddFoodModal && (
              <div className="modal-overlay" >
                <div className="modal-content add-food-modal" onClick={(e) => e.stopPropagation()}>

                  <div className="modal-header">
                    <h3>הוספת מאכל חדש</h3>
                    <button className="close-x" onClick={() => setShowAddFoodModal(false)}>×</button>
                  </div>

                  <div className="form-grid">
                    {/* שם המאכל - שורה מלאה */}
                    <div className="input-group">
                      <label>שם המאכל</label>
                      <input
                        type="text"
                        placeholder="לדוגמה: חזה עוף"
                        value={newFood.name}
                        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                      />
                    </div>
                    {/* משקל ברירת מחדל */}
                    <div className="input-group">
                      <label>משקל (גרם)</label>
                      <div className="setup-number-control">
                        <button onClick={() => setNewFood(prev => ({ ...prev, defaultWeight: Math.max(0, Number(prev.defaultWeight) - 1) }))}>-</button>
                        <input
                          type="number" placeholder='0'
                          value={newFood.defaultWeight}
                          onChange={(e) => setNewFood({ ...newFood, defaultWeight: Math.max(0, Number(e.target.value)) })}
                        />
                        <button onClick={() => setNewFood(prev => ({ ...prev, defaultWeight: Number(prev.defaultWeight) + 1 }))}>+</button>
                      </div>
                    </div>

                    {/* קלוריות - עם כפתורי פלוס מינוס */}
                    <div className="input-group">
                      <label>קלוריות</label>
                      <div className="setup-number-control">
                        <button onClick={() => setNewFood(prev => ({ ...prev, calories: Math.max(0, Number(prev.calories) - 1) }))}>-</button>
                        <input
                          type="number" placeholder='0'
                          value={newFood.calories}
                          onChange={(e) => setNewFood({ ...newFood, calories: Math.max(0, Number(e.target.value)) })}
                        />
                        <button onClick={() => setNewFood(prev => ({ ...prev, calories: Number(prev.calories) + 1 }))}>+</button>
                      </div>
                    </div>

                    {/* חלבון */}
                    <div className="input-group">
                      <label>חלבון (גרם)</label>
                      <div className="setup-number-control">
                        <button onClick={() => setNewFood(prev => ({ ...prev, protein: Math.max(0, Number(prev.protein) - 1) }))}>-</button>
                        <input
                          type="number" placeholder='0'
                          value={newFood.protein}
                          onChange={(e) => setNewFood({ ...newFood, protein: Math.max(0, Number(e.target.value)) })}
                        />
                        <button onClick={() => setNewFood(prev => ({ ...prev, protein: Number(prev.protein) + 1 }))}>+</button>
                      </div>
                    </div>


                  </div>
                  <div className="btn">
                    <button className='save-add-btn' onClick={addToMaster}>הוספה</button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;