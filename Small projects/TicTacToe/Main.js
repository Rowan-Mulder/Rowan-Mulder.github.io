"use strict"


Vue.component('button-vak', {
	data: function() {
		return {
			XO: "",
			vakOpmaak: {
				backgroundColor: "#DDD"
			}
		}
	},
	template: '<button v-on:click="Move()" :style="vakOpmaak" class="vak">{{ XO }}</button>',
	methods: {
		Move: function() {
			if (this.XO == "" && this.$parent.winnaar == "") {
				this.$parent.aantalZetten++
				this.XO = this.$parent.beurt
				this.$parent.CheckVictory()
				this.$parent.NextPlayer()
			}
		}
	}
})

var object1 = new Vue({
	el: '#boter-kaas-en-eieren',
	data: {
		beurt: "X",
		winnaar: "",
		aantalZetten: 0
	},
	methods: {
		NextPlayer: function() {
			if (this.beurt == "X") {
				this.beurt = "O"
			} else {
				this.beurt = "X"
			}
		},
		CheckVictory: function() {
			if (this.winnaar == "") {
				let inputArray = new Array()
				
				for (let i = 0; i < this.$children.length; i++) {
					inputArray.push(this.$children[i].XO)
				}
				
				if (inputArray[0] == "X" && inputArray[1] == "X" && inputArray[2] == "X") {
					this.Victory("X", 1)
				} else if (inputArray[3] == "X" && inputArray[4] == "X" && inputArray[5] == "X") {
					this.Victory("X", 2)
				} else if (inputArray[6] == "X" && inputArray[7] == "X" && inputArray[8] == "X") {
					this.Victory("X", 3)
				} else if (inputArray[0] == "X" && inputArray[4] == "X" && inputArray[8] == "X") {
					this.Victory("X", 4)
				} else if (inputArray[6] == "X" && inputArray[4] == "X" && inputArray[2] == "X") {
					this.Victory("X", 5)
				} else if (inputArray[0] == "X" && inputArray[3] == "X" && inputArray[6] == "X") {
					this.Victory("X", 6)
				} else if (inputArray[1] == "X" && inputArray[4] == "X" && inputArray[7] == "X") {
					this.Victory("X", 7)
				} else if (inputArray[2] == "X" && inputArray[5] == "X" && inputArray[8] == "X") {
					this.Victory("X", 8)
				} else if (inputArray[0] == "O" && inputArray[1] == "O" && inputArray[2] == "O") {
					this.Victory("O", 1)
				} else if (inputArray[3] == "O" && inputArray[4] == "O" && inputArray[5] == "O") {
					this.Victory("O", 2)
				} else if (inputArray[6] == "O" && inputArray[7] == "O" && inputArray[8] == "O") {
					this.Victory("O", 3)
				} else if (inputArray[0] == "O" && inputArray[4] == "O" && inputArray[8] == "O") {
					this.Victory("O", 4)
				} else if (inputArray[6] == "O" && inputArray[4] == "O" && inputArray[2] == "O") {
					this.Victory("O", 5)
				} else if (inputArray[0] == "O" && inputArray[3] == "O" && inputArray[6] == "O") {
					this.Victory("O", 6)
				} else if (inputArray[1] == "O" && inputArray[4] == "O" && inputArray[7] == "O") {
					this.Victory("O", 7)
				} else if (inputArray[2] == "O" && inputArray[5] == "O" && inputArray[8] == "O") {
					this.Victory("O", 8)
				}
			} else {
				
			}
		},
		Victory: function(winnaar, richting) {
			switch(richting) {
				case 1:
					// Boven horizontaal
					this.$children[0].vakOpmaak.backgroundColor = "green"
					this.$children[1].vakOpmaak.backgroundColor = "green"
					this.$children[2].vakOpmaak.backgroundColor = "green"
					break;
				case 2:
					// Midden horizontaal
					this.$children[3].vakOpmaak.backgroundColor = "green"
					this.$children[4].vakOpmaak.backgroundColor = "green"
					this.$children[5].vakOpmaak.backgroundColor = "green"
					break;
				case 3:
					// Onder horizontaal
					this.$children[6].vakOpmaak.backgroundColor = "green"
					this.$children[7].vakOpmaak.backgroundColor = "green"
					this.$children[8].vakOpmaak.backgroundColor = "green"
					break;
				case 4:
					// Diagonaal rechtsonder
					this.$children[0].vakOpmaak.backgroundColor = "green"
					this.$children[4].vakOpmaak.backgroundColor = "green"
					this.$children[8].vakOpmaak.backgroundColor = "green"
					break;
				case 5:
					// Diagonaal rechtsboven
					this.$children[2].vakOpmaak.backgroundColor = "green"
					this.$children[4].vakOpmaak.backgroundColor = "green"
					this.$children[6].vakOpmaak.backgroundColor = "green"
					break;
				case 6:
					// Links verticaal
					this.$children[0].vakOpmaak.backgroundColor = "green"
					this.$children[3].vakOpmaak.backgroundColor = "green"
					this.$children[6].vakOpmaak.backgroundColor = "green"
					break;
				case 7:
					// Midden verticaal
					this.$children[1].vakOpmaak.backgroundColor = "green"
					this.$children[4].vakOpmaak.backgroundColor = "green"
					this.$children[7].vakOpmaak.backgroundColor = "green"
					break;
				case 8:
					// Rechts verticaal
					this.$children[2].vakOpmaak.backgroundColor = "green"
					this.$children[5].vakOpmaak.backgroundColor = "green"
					this.$children[8].vakOpmaak.backgroundColor = "green"
					break;
			}
			this.winnaar = winnaar
			setTimeout(() => {
				alert(`De winnaar is: ${winnaar}!\n(in ${this.aantalZetten} zetten)`)
			}, 10)
		},
		ResetGame: function() {
			this.winnaar = ""
			this.aantalZetten = 0
			
			for (let i = 0; i < this.$children.length; i++) {
				this.$children[i].XO = ""
				this.$children[i].vakOpmaak.backgroundColor = "#DDD"
			}
		}
	}
})