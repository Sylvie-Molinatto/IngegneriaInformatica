									AREA ASM_functions, CODE, READONLY				
									EXPORT  differenza_media_positivi_negativi
					
differenza_media_positivi_negativi  PROC
									; save current SP for a faster access 
									; to parameters in the stack
									MOV   r12, sp
									; save volatile registers
									STMFD sp!,{r4-r8,r10-r11,lr}	
									
									MOV r5, #0 ;valori positivi
									MOV r6, #0 ;valori negativi
									MOV r7, #0xFF
									MOV r8, #0 ;numero positivi
									MOV r9, #0 ;numero negativi
	
ciclo	
									LDR r4, [r0]							
									CMP r4, #0
									BGE pos
									ADD r9,r9, #1
									ADDS r6, r6, r4				
									B next
pos				
									ADD r8,r8, #1
									ADDS r5, r5, r4				
next
									STRVS r7, [r2]  ;salvo FF come valore overflow
									ADD r0, r0, #4
									SUB r1, r1, #1
									CMP r1, #0
									BNE ciclo
									
									SDIV r5, r5, r8
									SDIV r6, r6, r9
									
									ADD r0, r5, r6			
									
									; restore volatile registers
									LDMFD sp!,{r4-r8,r10-r11,pc}
									
									ENDP
									END