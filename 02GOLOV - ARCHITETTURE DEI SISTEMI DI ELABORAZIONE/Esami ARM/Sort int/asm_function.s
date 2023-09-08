		        AREA asm_function, CODE, READONLY				
				EXPORT sort
				
				; save current SP for a faster access to parameters in the stack
				MOV   r12, sp
				; save volatile registers
sort		    STMFD sp!,{r4-r8,r10-r11,lr}
							    
bsort_next                                  ; Check for a sorted array
                MOV     R2,#0               ; R2 = Current Element Number
                MOV     R6,#0               ; R6 = Number of swaps
bsort_loop                                  ; Start loop
                ADD     R3,R2,#1            ; R3 = Next Element Number
                CMP     R3,R1               ; Check for the end of the array
                BGE     bsort_check         ; When we reach the end, check for changes
                LDR     R4,[R0,R2,LSL #2]   ; R4 = Current Element Value
                LDR     R5,[R0,R3,LSL#2]    ; R5 = Next Element Value
                CMP     R4,R5               ; Compare element values
                STRGT   R5,[R0,R2,LSL#2]    ; If R4 > R5, store current value at next
                STRGT   R4,[R0,R3,LSL#2]    ; If R4 > R5, Store next value at current
                ADDGT   R6,R6,#1            ; If R4 > R5, Increment swap counter
                MOV     R2,R3               ; Advance to the next element
                B       bsort_loop          ; End loop
bsort_check                                 ; Check for changes
                CMP     R6,#0               ; Were there changes this iteration?
                SUBGT   R1,R1,#1            ; Optimization: skip last value in next loop
                BGT     bsort_next          ; If there were changes, do it again

				; restore volatile registers
fine		    LDMFD sp!,{r4-r8,r10-r11,pc}
				
                END