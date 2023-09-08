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
# define M 3
# define N 4

volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_left = 0;
volatile int J_right = 0;

unsigned int MAT[M][N];
unsigned int riga=0;
unsigned int colonna=0;
int acquisition=1;
unsigned int result;
unsigned int num;
extern unsigned int average_reference(unsigned int MAT[][N], unsigned int num, int RIGHT_LEFT);
int led_accesi=0;

void RIT_IRQHandler (void)
{		
	// LEFT 
	if((LPC_GPIO1->FIOPIN & (1<<27)) == 0){	
		J_left++;
		switch(J_left){
			case 1:
				acquisition=0;
				result = average_reference(MAT,num,0);
			  disable_timer(0);
			  disable_timer(1);
			  enable_timer(2);
			  enable_timer(3);
			  led_accesi=0;
				break;
			default:
				break;
		}
	}
	else{
			J_left=0;
	}
	
	// RIGHT
	if((LPC_GPIO1->FIOPIN & (1<<28)) == 0){		
		J_right++;
		switch(J_right){
			case 1:
				acquisition=0;
				result = average_reference(MAT,num,1);
			  disable_timer(0);
			  disable_timer(1);
			  enable_timer(2);
			  enable_timer(3);
			  led_accesi=0;
				break;
			default:
				break;
		}
	}
	else{
			J_right=0;
	}
	
	// KEY1
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){
			switch(down_1){
				case 2:
					if(acquisition==1){
						 disable_timer(0);
				     MAT[riga][colonna]=LPC_TIM0->TC;
				     enable_timer(0);
						 num++;
				     if(colonna<N-1){
						   colonna++;
					   }
					   else if(colonna==N-1 && riga<M-1){
						   colonna=0;
						   riga++;
					   }
					  else{
						   acquisition=0;
					  }
					  LED_Out_Upper(riga);
				    LED_Out_Lower(colonna);
				  }
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
	
	// KEY2
	if(down_2!=0){  
			down_2 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<12)) == 0){
			switch(down_2){
				case 2:
					if(acquisition==1){
						disable_timer(1);
				    MAT[riga][colonna]=LPC_TIM1->TC;
				    enable_timer(1);
						num++;
				    if(colonna<N-1){
						  colonna++;
					  }
					  else if(colonna==N-1 && riga<M-1){
						  colonna=0;
						  riga++;
					  }
					  else{
						  acquisition=0;
					  }
					  LED_Out_Upper(riga);
				    LED_Out_Lower(colonna);
					  }
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			down_2=0;			
			NVIC_EnableIRQ(EINT2_IRQn);							 
			LPC_PINCON->PINSEL4    |= (1 << 24);     
		}
	}

	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
