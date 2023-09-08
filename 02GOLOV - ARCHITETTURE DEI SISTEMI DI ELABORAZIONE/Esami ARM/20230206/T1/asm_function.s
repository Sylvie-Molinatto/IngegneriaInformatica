
		                      AREA asm_function, CODE, READONLY				
				              EXPORT calcola_somma_prodotto
				
				              ; save current SP for a faster access to parameters in the stack
calcola_somma_prodotto	      MOV   r12, sp
				              ; save volatile registers
				              STMFD sp!,{r4-r8,r10-r11,lr}				
				               
							  ; R0 VETT
							  ; R1 posizione
							  ; R2 alarm
							  
							  MOV R3, #0 ;i
							  MOV R8, #0 ; result
							  
ciclo						  ADD R4, R3, #1 
                              CMP R4, R1
							  BGE fine
							  LDR R5, [R0, R3, LSL#2]
							  LDR R6, [R0, R4, LSL#2]
							  MUL R7, R5, R6
							  ADD R8, R8, R7
							  ADD R3, R3, #2  
				              B ciclo
							  
				              ; restore volatile registers
fine		                  MOV R0, R8
                              CMP R8, #255
							  MOVLO R9, #-1
							  MOVGE R9, #1
							  STR R9, [R2]
                              LDMFD sp!,{r4-r8,r10-r11,pc}
                              END