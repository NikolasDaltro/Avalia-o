new Vue({
	el: '#desafio',
	data: {
		classe1:'destaque',
		
	},
	methods: {
		pararEfeito(){
			this.classe1 = false;
		},
		iniciarEfeito() {
			setInterval(() =>{
				this.classe1 = this.classe1 == 'destaque' ? 'encolher' : 'destaque'
			},1000)
		},
		iniciarProgresso() {

		}
	}
})
