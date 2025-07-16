# React Hooks Quick Reference

## useState
```javascript
const [state, setState] = useState(initialValue);
```

## useEffect
```javascript
useEffect(() => {
  // effect logic
  return () => {
    // cleanup
  };
}, [dependencies]);
```

## useContext
```javascript
const value = useContext(MyContext);
```

## useCallback
```javascript
const memoizedCallback = useCallback(() => {
  // callback logic
}, [dependencies]);
```

## useMemo
```javascript
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

## Custom Hook Pattern
```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}
``` 