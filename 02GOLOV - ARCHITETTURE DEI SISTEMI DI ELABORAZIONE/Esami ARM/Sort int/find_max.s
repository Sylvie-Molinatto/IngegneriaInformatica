                AREA max, CODE, READONLY				
				EXPORT find_max
				
				; save current SP for a faster access to parameters in the stack
				MOV   r12, sp
				; save volatile registers
find_max		STMFD sp!,{r4-r8,r10-r11,lr}
							    
                ; R0 VETT[]
				; R1 N
				; R2 pos_max
				; R4 MAX
				; R5 POS
				
				MOV R3, #0 ; posizione
				MOV R4, #0 ; MAX
				MOV R5, #0 ; POS
				
loop			LDR R6, [R0, R3, LSL#2]
				CMP R6, R4
				MOVGT R4, R6
				MOVGT R5, R3
				ADD R3, R3, #1
				CMP R3, R1
				BLO loop
				
				
				STR R5, [R2]
				
fine		    MOV R0, R4
				; restore volatile registers		    
                LDMFD sp!,{r4-r8,r10-r11,pc}
				END