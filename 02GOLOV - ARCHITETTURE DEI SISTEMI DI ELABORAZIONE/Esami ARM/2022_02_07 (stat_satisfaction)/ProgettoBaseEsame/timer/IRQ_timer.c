/*********************************************************************************************************
**--------------File Info---------------------------------------------------------------------------------
** File name:           IRQ_timer.c
** Last modified Date:  2014-09-25
** Last Version:        V1.00
** Descriptions:        functions to manage T0 and T1 interrupts
** Correlated files:    timer.h
**--------------------------------------------------------------------------------------------------------
*********************************************************************************************************/
#include "lpc17xx.h"
#include "timer.h"
#include "../led/led.h"

extern int numLed;
extern char percentuali[3];
/******************************************************************************
** Function name:		Timer0_IRQHandler
**
** Descriptions:		Timer/Counter 0 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
extern unsigned char led_value;					/* defined in funct_led								*/

extern int mod_show_leds;

int mod_show_p=0;
int ledAccesi=0;
int i = 0;

void TIMER0_IRQHandler (void)
{
	// timer per mostrare la pressione di un pulsante per 1s su un LED
	LED_Out(0x00);
	
  LPC_TIM0->IR = 1;
	return;
}


/******************************************************************************
** Function name:		Timer1_IRQHandler
**
** Descriptions:		Timer/Counter 1 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER1_IRQHandler (void)
{
	if(i<3){
		if(mod_show_leds==1 && mod_show_p==0){
		  // timer di 2 s per mostrare il numero di clienti
	    LED_Out(0x00);
	    // lampeggio a 5Hz per 2 sec 
	    enable_timer(2);
	    enable_timer(1);
		}
		else{
			mod_show_leds=1;
	  	mod_show_p=0;
		  enable_timer(1);
		  disable_timer(2);
	    LED_Out(percentuali[i-1]);
		  i++;
	 }
  }
	else{
		disable_timer(1);
		disable_timer(2);
		LED_Out(0x00);
		i=0;
	}
	
	
  LPC_TIM1->IR = 1;			/* clear interrupt flag */
  return;
}

/******************************************************************************
** Function name:		Timer2_IRQHandler
**
** Descriptions:		Timer/Counter 2 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER2_IRQHandler (void)
{
	 // timer di 0.1 s per far lampeggiare i giusti led
	if(ledAccesi==0){
		LED_On(i+4);
		ledAccesi=1;
  }
	
  else{
		LED_Off(i+4);
		ledAccesi=0;
  }		
	
	mod_show_p=1;
  LPC_TIM2->IR = 1;			/* clear interrupt flag */
  return;
}

/******************************************************************************
** Function name:		Timer3_IRQHandler
**
** Descriptions:		Timer/Counter 3 interrupt handler
**
** parameters:			None
** Returned value:		None
**
******************************************************************************/
void TIMER3_IRQHandler (void)
{
  LPC_TIM3->IR = 1;			/* clear interrupt flag */
  return;
}






/******************************************************************************
**                            End Of File
******************************************************************************/
