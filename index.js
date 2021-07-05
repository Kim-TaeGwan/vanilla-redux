/*
  단일 스토어
  - 하나의 애플리케이션 안에는 하나의 스토어가 들어 있다.
  - 여러 개의 스토어를 사용하는 것이 완전히 불가능하지는 않다.
  - 특정 업데이트가 너무 빈번하게 일어나거나 애플리케이션의 특정 부분을 완전히 분리시킬 떄 여러 개의 스토어를 만들 수도 있지만, 상태 관리가 복잡해질 수 있으므로 권장하디 않는다.

  읽기 전용 상태
  - 리덕스 상태는 읽기 전용이다.
  - 기존의 리액트에서 setState를 사용하여 state를 업데이트할때도 객체나 배열을 업데이트하는 과정에서 불변성을 지켜 주기 위해 spread 연산자를 사용하거나 immer 와 같은 불변성 관리 라이브러리를 사용했다.
  - 리덕스도 마찬가지이다. 상태를 업데이트할 때 기존의 객체는 건드리지 않고 새로운 객체를 생성해 주어야 한다.
  - 리덕스에서 불변성를 유지해야 하는 이유는 내부적으로 데이터가 변경되는 것을 감지하기 위해 얕은 비고 검사를 하기 때문이다.
  - 객체의 변화를 감지할 때 객체의 깊숙한 안쪽까지 비교하는 것이 아니라 겉핥기 식으로 비교하여 좋은 성능을 유지할 수 있는 것이다.

  리듀서는 순수한 함수
  - 변화를 일으키는 리듀서 함수는 순수한 함수여야 한다. 순수한 함수는 다음 조건을 만족한다.
    - 리듀서 함수는 이전 상태와 액션 객체를 파라미터로 받는다.
    - 파라미터 외의 값에는 의존하면 안된다.
    - 이전 상태는 절대로 건드리지 않고, 변화를 준 새로운 상태 객체를 만들어서 반환한다.
    - 똑같은 파라미터로 호출된 리듀서 함수는 언제나 똑같은 결과 값을 반환해야 한다.
*/

import { createStore } from "redux";

const divToggle = document.querySelector(".toggle");
const counter = document.querySelector("h1");
const btnIncrease = document.querySelector("#increase");
const btnDecrease = document.querySelector("#decrease");

// 액션 타입과 액션 생성 함수 정의
// 프로젝트의 상태에 변화를 일으키는 것을 액션이라고한다.
// 액션 이름은 문자열 형태로, 주로 대문자로 작성하며 액션 이름은 고유해야한다.
// 이름이 중복되면 의도하지 않은 결과가 발행할 수 있기 때문이다.
const TOGGLE_SWITCH = "TOGGLE_SWITCH";
const INCREASE = "INCREASE";
const DECREASE = "DECREASE";

// 액션 이름을 사용하여 액션 객체를 만드는 생성 함수를 작성해 준다.
// 액션 객체는 type 값을 반드시 갖고 있어야 하며
// 그 외에 추후 상태를 업데이트할 때 참고하고 싶은 값은 맘대로 넣는다.
const toggleSwitch = () => ({ type: TOGGLE_SWITCH });
const increase = difference => ({ type: INCREASE, difference });
const decrease = () => ({ type: DECREASE });

// 초기값 설정
const initialState = {
  toggle: false,
  counter: 0,
};

// 리듀서 함수 정의
// 리듀서는 변화를 일으키는 함수이다.
// 함수의 피라미터로는 state 와 action 값을 받아 온다.
// state 가 undefined일 때는 initialState를 기본값으로 사용
// 리듀서 함수가 맨 처음 호출될 떄는 state 값이 undefined이다.
// 해당 값이 undefined로 주어졌을 떄는 initialState를 기본값으로 설정하기 위해 함수의 파라미터 쪽에 기본값이 설정되어있다.
// 리듀서에서는 상태의 불변성을 유지하면서 데이터에 변화를 일으켜 주어야 한다.
// 이 작업을 할 때 spread 연산자(...)를 사용하면 편하다.
// 단 객체의 구조가 복잡해지면 spread 연산자로 불변성을 관리하며 업데이트 하는 것은 굉장히 번거로울 수 있고 코드의 가독성도 나빠지기 때문에
// 리덕스의 상태는 최대한 깊지 않은 구조로 진행하는 것이 좋다.
// 객체의 구조가 복잡해지거나 배열도 함께 다루는 경우 immer 라이브러리를 사용하면 좀 더 쉽게 리듀서를 작성할 수 있다.
function reducer(state = initialState, action) {
  // action.type에 따라 다른 작업을 처리함
  switch (action.type) {
    case TOGGLE_SWITCH:
      return {
        ...state, // 불변성 유지를 해 주어야 한다.
        toggle: !state.toggle,
      };
    case INCREASE:
      return {
        ...state,
        counter: state.counter + action.difference,
      };
    case DECREASE:
      return {
        ...state,
        counter: state.counter - 1,
      };
    default:
      return state;
  }
}

// 스토어를 만들 떄는 createStore 함수를 사용한다.
// 이 함수를 사용하려면 코드 상단에 import 구문을 넣어 리덕스에서 해당 함수를 불러와야 하고,
// 함수의 파라미터에는 리듀서 함수를 넣어 주어야 한다.
const store = createStore(reducer);

// render는 상태가 업데이트될 때 마다 호출되며, 리액트의 render 함수와는 다르게 이미 html을 사용하여 만들어진 UI의 속성을 상태에 따라 변경해 준다.
const render = () => {
  const state = store.getState(); // 현재 상태를 불러온다.
  // 토글 처리
  if (state.toggle) {
    divToggle.classList.add("active");
  } else {
    divToggle.classList.remove("active");
  }
  // 카운터 처리
  counter.innerText = state.counter;
};

render();
// vanilla js 에서는 subscribe함수를 직접 사용하지만,
// 리액트 프로젝트에서 리덕스를 사용할 때는 subscribe 함수를 직접 사용하지 않을 것이다.
// 왜나하면, 컴포넌트에서 리덕스 상태를 조회하는 과정에서 react-dedux 라는 라이브러리가 이 작업을 대신해 주기 때문이다.
store.subscribe(render); // 상태가 업데이트 될 때마다 render 함수를 호출

// 구독하기
// 이제 스토어의 상태가 바뀔 때마다 방금 만든 render 함수가 호출되도록 해 줄 것이다.
// 이 작업은 스토어의 내장 함수 subscribe를 사용하여 수행할 수 있다.
//subscribe 함수의 파라미터로는 함수 형태의 값을 전달해 준다.
// 이렇게 전달된 함수는 추후 액션이 발생하여 상태가 업데이트될 때마다 호출
const listener = () => {
  console.log("상태가 업데이트 됨");
};
const unsubscribe = store.subscribe(listener);

unsubscribe(); // 추후 구독을 비활성화할 떄 함수를 호출

// 액션을 발생시키는 것을 디스패치라고 한다.
// 디스패치를 할 때는 스토어의 내장 함수 dispatch를 사용한다. 파라미터는 액션 객체를 넣어 주면 된다.
// 이벤트 함수 내부에서는 dispatch 함수를 사용하여 액션을 스토어에게 전달해 주겠다.
divToggle.onclick = () => {
  store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
  store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
  store.dispatch(decrease());
};
