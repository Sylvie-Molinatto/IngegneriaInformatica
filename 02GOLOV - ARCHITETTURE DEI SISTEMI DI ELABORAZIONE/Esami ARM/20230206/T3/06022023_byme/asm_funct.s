									AREA ASM_functions, CODE, READONLY
									EXPORT differenza_media_positivi_negativi

differenza_media_positivi_negativi	PROC
									
									; save volatile registers
									STMFD SP!,{R4-R8,R10-R11,LR}
									
									MOV R4, #0		; somma positivi
									MOV R5, #0		; somma negativi
									MOV R9, R1		; indice
									MOV R10, #0xFF
loop									
									LDR R6, [R0]
									CMP R6, #0
									BPL pos
									ADDS R5, R5, R6
									B next
pos
									ADDS R4, R4, R6
next
									STRVS R10, [R2]
									ADD R0, R0, #4
									SUBS R9, R9, #1
									BNE loop
									
									SDIV R4, R4, R1
									SDIV R5, R5, R1
									SUB R0, R4, R5
									
									; restore volatile registers
									LDMFD SP!,{R4-R8,R10-R11,PC}
									
									ENDP
									END