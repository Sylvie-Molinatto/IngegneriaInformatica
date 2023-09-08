				
; Flags: NZCV
; - EQ:(==) Z set 
; - NE:(!=) Z clear 
; - HI:(> ) C set, Z clear 
; - HS:(>=) C set 
; - LO:(< ) C clear
; - LS:(<=) C clear, Z set 
; - MI:(negative) N set
; - PL:(positive) N clear
; - VS:(overflow) V set
; - VC:(no oflow) V clear

; ALU instructions:
; - TST r1, r2: (&)logical AND 
; - CMP r1, r2: arithmetic subtract (-)
; - ADD, MUL, SUB: 32 bit
; - ADC, U/SMULL, SBC: 64 bit
; - U/SDIV: 32 bit
; - LSL/R: logical shift left/right
; - MOV Rd, #const: loads 16-bit const (0x00XY00XY)
; - LDR Rd, =const: loads (word) const in register
; - LDR Rd, =label: loads address in register
; - LDRB/H/D/M: loads byte/half-word/2-words/multiple
; - STRB/H/D/M: stores byte/half-word/2-words/multiple
					
; Branch instructions:
; - B label: branch to label
; - BX Rn: branch to register address
; - BL label: branch and link
; - BLX Rn: branch to register and link

; Conditional (after CMP Rn, op {= Rm/#imm}):
; - BEQ: branch if Rn == op
; - BLO: branch if Rn < op
; - BLS: branch if Rn <= op
; - BHI: branch if Rn > op
; - BHS: branch if Rn >= op
; - see "Flags" for other suffix

; Directives:
; - name EQU expr : constant declaration
; - {label} DCxx expr{,expr}: constant allocation
; 	- DCB/W: define costant byte/half-word
;	- DCWU: half-word unaligned
;	- DCD: define costant word
;	- DCDU: word unaligned
;		- ('expr' can be a string)
; - ALIGN {expr{, offset}}: alignment, pad with 0s
; 	- current location: n * expr + offset
; - {label} SPACE expr: memory block reservation
; 	- expr: number of bytes
; - LTORG: collocates the literal pool

; Addressing:
; - load/store Rd, [Rn, offset{, LSL #const}]{!}: pre-indexed
;	- offset: 12-bit const or register
; 	- !: updates Rn at end of instruction
; - load/store Rd, [Rn], offset: post-indexed
; 	- offset: Rn is always updated

				AREA asm_functions, CODE, READONLY
				EXPORT C_function_name
C_function_name ; code goes below
				; save current sp for a faster access to parameters in the stack
				MOV r12, sp
				; save volatile registers
				STMFD sp!, {r4-r8, r10-r11, lr}
				
				; code body
				
				; setup a value for r0 to return
; fine				
				; MOV r0, rN
				; restore volatile registers
				LDMFD sp!, {r4-r8, r10-r11, pc}
				
				END
				; end of code