/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_RIT.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    RIT.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "RIT.h"
#include "../led/led.h"
#include "../timer/timer.h"

/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_select = 0;

extern unsigned int count_bits_to_1 (unsigned int VAR1);

void RIT_IRQHandler (void)
{		
	unsigned int TC;
	static unsigned int VAR1 = 7;
	static unsigned int res = 0;
	
	// SELECT
	if((LPC_GPIO1->FIOPIN & (1<<25)) == 0){	
		J_select++;
		switch(J_select){
			case 1:
				break;
			case 80:         /* 4s/50ms=80 */
				disable_timer(0);
			  res = count_bits_to_1(VAR1);
			
			  if(res>=0 && res<4){
					LED_Out(0xff);
				}
				else if(res>=4 && res<11){
					LED_On(res-4);
				}
				else{
					enable_timer(0);
					
				}
			  VAR1 = 7;
				break;
			default:
				break;
		}
	}
	else{
			J_select=0;
	}
	
	
  // INT0
	if(down_0!=0){  
			down_0 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<10)) == 0){
			switch(down_0){
				case 2:
					VAR1 = VAR1 >> 1;
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_0=0;			
			NVIC_EnableIRQ(EINT0_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 20);     
		}
	}
	
	// KEY1
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){
			switch(down_1){
				case 2:
					/* stop timer 2 - get value - VAR1 += value */
				  disable_timer(2);
				  TC = LPC_TIM2->TC;
				  VAR1 += TC;
				  enable_timer(2);
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_1=0;			
			NVIC_EnableIRQ(EINT1_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 22);     
		}
	}
	
	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
