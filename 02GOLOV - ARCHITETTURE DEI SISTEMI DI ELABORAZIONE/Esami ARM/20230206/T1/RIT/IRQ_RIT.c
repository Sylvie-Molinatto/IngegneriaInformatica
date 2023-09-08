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
#include <stdio.h>
/******************************************************************************
** Function name:		RIT_IRQHandler
**
** Descriptions:		REPETITIVE INTERRUPT TIMER handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
#define dim 8

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_select = 0;
volatile int J_down = 0;
volatile int J_left = 0;
volatile int J_right = 0;
volatile int J_up = 0;

unsigned int VETT[dim]={0};
unsigned int VAR1=0;
unsigned int VAR2=0;
unsigned int posizione=0;
int stato=0; // Stato = 0 -> ACQUISIZIONE, Stato=1 -> VISUALIZZAZIONE
char alarm;
unsigned int result;

extern unsigned int calcola_somma_prodotto(unsigned int VETT[], unsigned int N, char* alarm);

void RIT_IRQHandler (void)
{		
	int i;
	
	// DOWN
	if((LPC_GPIO1->FIOPIN & (1<<26)) == 0){	
	
		J_down++;
		switch(J_down){
			case 1:
				if(stato==0){
					if(posizione<dim-1){
						VETT[posizione++]=VAR1;
			      VETT[posizione++]=VAR2;
				  }
				  else{
					  disable_timer(0);
						reset_timer(0);
				    disable_timer(1);
						reset_timer(1);
					  result = calcola_somma_prodotto(VETT, posizione, &alarm);
					  stato=1;
					  if(alarm==1){
						  enable_timer(2);
					  }
					  else{
						  LED_Out(result);
					  }
				  }
				}
				break;
			default:
				break;
		}
	}
	else{
			J_down=0;
	}
	
	// LEFT 
	if((LPC_GPIO1->FIOPIN & (1<<27)) == 0){	
		J_left++;
		switch(J_left){
			case 1:
				if(stato==0){
					VAR2+=1;
			    if(VAR2<=15){
					  LED_Out_Lower(VAR2);
				  }
				  else{
					  enable_timer(1);
				  }
				}
				
				break;
			default:
				break;
		}
	}
	else{
			J_left=0;
	}
	
	// UP
	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	
		J_up++;
		switch(J_up){
			case 1:
				if(stato==0){
					VAR2+=1;
			    if(VAR2<=15){
					  LED_Out_Lower(VAR2);
				  }
				  else{
					  enable_timer(1);
				  }
			  }
				break;
			default:
				break;
		}
	}
	else{
			J_up=0;
	}
	
	
	// KEY1
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){
			switch(down_1){
				case 2:
					if(stato==1){
						stato=0;
						for(i=0;i<dim;i++){
							VETT[i]=0;
						}
						VAR1=0;
						VAR2=0;
						posizione=0;
						alarm=0;
						disable_timer(2);
						reset_timer(2);
						LED_Off_All();
					}
					break;
				default:
					break;
			}
		}
		else {	/* button released */
			
			if(stato==0){
					if(down_1<50){
				       VAR1+=2;
			    }
					else if(down_1>=50 && down_1<60){
				       VAR1+=3;
			    }
			    else{
						disable_timer(0);
						reset_timer(0);
						disable_timer(1);
						reset_timer(1);
						stato=1;
						result = calcola_somma_prodotto(VETT, posizione, &alarm);
						if(alarm==1){
							enable_timer(2);
				    }
						else{
							LED_Out(result);
				    }
			   }
			
				 if(VAR1<=15){
				    LED_Out_Upper(VAR1);
			   }
			   else{
				    enable_timer(0);
			   }
			}
			
		
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
