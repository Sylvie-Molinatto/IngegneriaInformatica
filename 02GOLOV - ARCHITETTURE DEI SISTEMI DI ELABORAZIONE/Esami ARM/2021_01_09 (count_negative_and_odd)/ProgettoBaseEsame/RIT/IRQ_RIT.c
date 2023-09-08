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
#define N 5

extern int count_negative_and_odd(int* VETT, unsigned int n);

int VAR1 = 0;
int VETT[N] = {0};
int position = 0;

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_select = 0;
volatile int J_down = 0;
volatile int J_left = 0;
volatile int J_right = 0;
volatile int J_up = 0;

void RIT_IRQHandler (void)
{		
	static int result;
	static int i;
	
	// SELECT
	if((LPC_GPIO1->FIOPIN & (1<<25)) == 0){	
		J_select++;
		switch(J_select){
			case 1:
				if(position<N){
					VETT[position]=VAR1;
					position++;
					VAR1=0;
				}
				else{
					result = count_negative_and_odd(VETT, N);
					if(result==0){
						enable_timer(0);
						LED_On(7);
					}
					else{
						LED_Out(result<<1); 
					}
					
					for(i=0;i<N;i++){
						VETT[i]=0;
					}
					VAR1=0;
					
				}
				break;
			default:
				break;
		}
	}
	else{
			J_select=0;
	}
	
	// DOWN
	if((LPC_GPIO1->FIOPIN & (1<<26)) == 0){	
		
		J_down++;
		switch(J_down){
			case 1:
				VAR1-=8;
				break;
			default:
				break;
		}
	}
	else{
			J_down=0;
	}	
	
	// UP
	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	
		J_up++;
		switch(J_up){
			case 1:
				VAR1+=12;
				break;
			default:
				break;
		}
	}
	else{
			J_up=0;
	}

	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
