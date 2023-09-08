
		             AREA asm_function, CODE, READONLY				
				     EXPORT average_reference
				
				      ; save current SP for a faster access to parameters in the stack
average_reference	  MOV   r12, sp
				      ; save volatile registers
				      STMFD sp!,{r4-r8,r10-r11,lr}				
			          
					  ; R0 MAT
					  ; R1 num
					  ; R2 LEFT/RIGHT
					  MOV R3, #0 ; contatore
					  MOV R4, #0 ; somma
					  MOV R5, #0 ; media
					  

avg                   LDR R6,[R0,R3,LSL #2]   ; R& = Current Element Value
					  ADD R4, R4, R6
					  ADD R3, R3, #1
					  CMP R3, R1
					  BNE avg
					  UDIV R5, R4, R1
					  
					  
					  MOV R3, #0
					  MOV R4, #0
					  CMP R2, #0
					  BEQ left
					  
					  ; R5 media
					  ; R4 cont

right                 LDR R6,[R0,R3,LSL #2]   ; R& = Current Element Value
                      CMP r6, r5
					  ADDLE r4, r4, #1
					  ADD R3, R3, #1
					  CMP R3, R1
					  BNE right
                      B fine


left                  LDR R6,[R0,R3,LSL #2]   ; R& = Current Element Value
                      CMP r6, r5
					  ADDGE r4, r4, #1
					  ADD R3, R3, #1
					  CMP R3, R1
					  BNE left
					  
			
				      ; restore volatile registers
fine		          MOV R0, R4
                      LDMFD sp!,{r4-r8,r10-r11,pc}
				
                      END