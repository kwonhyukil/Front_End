<!-- Option API -->
<script>
    // data()에서 반환된 속성들은 반응적인 상태가 되어
    // 'this'에 노출됩니다.
    export default {
        data () {
            return {
                count: 0
            }
        },

        // methods는 속성 값을 변경하고 업데이트 할 수 있는 함수
        // 템플릿 내에서 이벤트 헨들러로 바인딩 될 수 있음
        methods: {
            increment() {
                this.count++
            },
            decreased() {
                this.count--
            }
        },
        // 생명주기 훅 (Lifecycle hooks)는 컴포넌트 생명주기의
        // 여러 단계에서 호출됩니다.
        // 이 함수는 컴포넌트가 마운ㅌ 된 후 호출됩니다.
        mounted() {
            console.log('숫자 세기의 초기값은 ${ this.count } 입니다.')
        }
    }
    
    
</script>

<template>
    <h1>{{ count }}</h1>
    <button @click="increment">증가</button>
    <button @click="decreased">감소</button>
</template>

<style scoped>
button{
    font-weight: bold;
}
</style>