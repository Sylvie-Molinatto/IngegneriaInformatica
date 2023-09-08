
		        AREA asm_function, CODE, READONLY				
				EXPORT overflow
				
				; save current SP for a faster access to parameters in the stack
overflow	    MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
			    
				
				; R0 V[N]
				; R1 N
				
				MOV R2, #0 ;contatore
				MOV R4, #0 ;somma
				
ciclo			LDR R3, [R0]
                ADDS R4, R4, R3
				BVS return_0
				BCS return_1
				ADD R0, R0, #4
				SUBS R1, R1, #1
				BNE ciclo
				
				MOV R0, #2
				B fine
				
return_0        MOV R0, #0
                b fine

return_1        MOV R0, #0
			    b fine
			
				; restore volatile registers
fine		    LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END