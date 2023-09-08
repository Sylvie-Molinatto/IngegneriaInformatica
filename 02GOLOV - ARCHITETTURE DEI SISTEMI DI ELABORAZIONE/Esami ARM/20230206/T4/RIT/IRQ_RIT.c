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
#define N 4

volatile int down_0 = 0;
volatile int down_1 = 0;
volatile int down_2 = 0;
volatile int J_select = 0;
volatile int J_down = 0;
volatile int J_left = 0;
volatile int J_right = 0;
volatile int J_up = 0;

unsigned char VETT[N]={0};
unsigned char VAR = 0;
int posizione = 0;
extern int media_e_superiori_alla_media(unsigned char V[], unsigned int num, char* super);
int stato=0; // 0=ACQUISIZIONE, 1=VISUALIZZAZIONE
char super;
int result;

void RIT_IRQHandler (void)
{		
	static int i;
	static int premuto=0;
	static char durata;
	// UP
	if((LPC_GPIO1->FIOPIN & (1<<29)) == 0){	
		J_up++;
		switch(J_up){
			case 1:
				break;
			default:
				break;
		}
	}
	else{
		if(stato==0){
			
			durata = J_up*0.05;
		  /*if(J_up>0 && J_up<20){
				VAR+=1;
			}
			else if(J_up>=20 && J_up<40){
				VAR+=2;
			}
			else if(J_up>=40 && J_up<60){
				VAR+=4;
			}
			else if(J_up>=60 && J_up<80){
				VAR+=6;
			} */
			
			if(J_up>0 && J_up<20){
				VAR+=1;
			}
			else{
			  VAR+=durata*2;
			}
			
			LED_Out(VAR);
		}
			J_up=0;
	}
	
	// KEY1
	if(down_1!=0){  
			down_1 ++;  
		if((LPC_GPIO2->FIOPIN & (1<<11)) == 0){
			switch(down_1){
				case 2:
					if(premuto==0){
						stato=1;
				    LED_Off_All();
				    result=media_e_superiori_alla_media(VETT,posizione,&super);
				    enable_timer(0);
						premuto=1;
					}
					else{
						LED_Off_All();
						disable_timer(0);
						posizione=0;
						stato=0;
						super=0;
						result=0;
						for(i=0;i<N;i++){
							VETT[i]=0;
						}
						VAR=0;
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
	
	reset_RIT();
  LPC_RIT->RICTRL |= 0x1;	/* clear interrupt flag */
	
  return;
}

/******************************************************************************
**                            End Of File
******************************************************************************/
