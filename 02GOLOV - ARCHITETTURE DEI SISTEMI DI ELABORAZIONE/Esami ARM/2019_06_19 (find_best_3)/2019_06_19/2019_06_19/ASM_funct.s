				
				
				AREA asm_functions, CODE, READONLY				
                EXPORT  find_best_3
				EXPORT  DATA_IN
find_best_3		;DATA_IN[], int n, char BEST_3[]
				; save current SP for a faster access 
				; to parameters in the stack
				MOV   r12, sp
				; save volatile registers
				STMFD sp!,{r4-r8,r10-r11,lr}				
				; extract argument 4 and 5 into R4 and R5
				LDRSB r3,[r0],#1
				STRB r3,[r2]
				LDRSB r3,[r0],#1
				STRB r3,[r2,#1]
				LDRSB r3,[r0],#1
				STRB r3,[r2,#2]
				MOV r9,r1
				SUB r1,r1,#3
loop1			LDRSB r3,[r0],#1
				MOV r5,#0
				MOV r6,r3
				MOV r8, #-1
loop2			LDRSB r4,[r2,r5]
				CMP r4,r6
				MOVLT r6,r4	;metti il minimo in r6
				MOVLT r8,r5 ;indice val minore nel vettore
				ADD r5,r5,#1
				CMP	r5,#3
				BNE loop2
				CMP	r8,#-1
				STRNE r3,[r2,r8]
				SUBS r1,r1,#1
				BNE	loop1
				
				; setup a value for R0 to return
				MOV	  r0, r9
				; restore volatile registers
				LDMFD sp!,{r4-r8,r10-r11,pc}
				
				AREA |.data|, DATA, READONLY
DATA_IN			DCB	-2,5,-10,20

                END