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
#define N 4
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
extern unsigned char VETT[];
extern unsigned char VAR;
extern unsigned int posizione;
extern int result;
extern char super;

void TIMER0_IRQHandler (void)
{
	/* Match register 0 interrupt service routine */
	if (LPC_TIM0->IR & 01)
	{
		LED_Out(result);
		LPC_TIM0->IR = 1;			/* clear interrupt flag */
	}
		
	/* Match register 1 interrupt service routine */
	else if(LPC_TIM0->IR & 02)
  {
		LED_Out(super);
		LPC_TIM0->IR =  2 ;			/* clear interrupt flag */	
	}
	
	/* Match register 2 interrupt service routine */
	else if(LPC_TIM0->IR & 4)
  {
		LPC_TIM0->IR =  4 ;			/* clear interrupt flag */	
	}
	
	/* Match register 3 interrupt service routine */
	else if(LPC_TIM0->IR & 8)
  {
		LPC_TIM0->IR =  8 ;			/* clear interrupt flag */	
	}
 
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
	/* Match register 0 interrupt service routine */
	if (LPC_TIM1->IR & 01)
	{
		LPC_TIM1->IR = 1;			/* clear interrupt flag */
	}
		
	/* Match register 1 interrupt service routine */
	else if(LPC_TIM1->IR & 02)
  {
		LPC_TIM1->IR =  2 ;			/* clear interrupt flag */	
	}
	
	/* Match register 2 interrupt service routine */
	else if(LPC_TIM1->IR & 4)
  {
		LPC_TIM1->IR =  4 ;			/* clear interrupt flag */	
	}
	
	/* Match register 3 interrupt service routine */
	else if(LPC_TIM1->IR & 8)
  {
		LPC_TIM1->IR =  8 ;			/* clear interrupt flag */	
	}
 
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
	/* Match register 0 interrupt service routine */
	if (LPC_TIM2->IR & 01)
	{
		LPC_TIM2->IR = 1;			/* clear interrupt flag */
	}
		
	/* Match register 1 interrupt service routine */
	else if(LPC_TIM2->IR & 02)
  {
		LPC_TIM2->IR =  2 ;			/* clear interrupt flag */	
	}
	
	/* Match register 2 interrupt service routine */
	else if(LPC_TIM2->IR & 4)
  {
		LPC_TIM2->IR =  4 ;			/* clear interrupt flag */	
	}
	
	/* Match register 3 interrupt service routine */
	else if(LPC_TIM2->IR & 8)
  {
		LPC_TIM2->IR =  8 ;			/* clear interrupt flag */	
	}
 
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
	/* Match register 0 interrupt service routine */
	if (LPC_TIM3->IR & 01)
	{
		if(posizione<N){
			VETT[posizione++]=VAR;
      VAR=0;
		}
		
    LPC_TIM3->IR = 1;			/* clear interrupt flag */
	}
		
	/* Match register 1 interrupt service routine */
	else if(LPC_TIM3->IR & 02)
  {
		LPC_TIM3->IR =  2 ;			/* clear interrupt flag */	
	}
	
	/* Match register 2 interrupt service routine */
	else if(LPC_TIM3->IR & 4)
  {
		LPC_TIM3->IR =  4 ;			/* clear interrupt flag */	
	}
	
	/* Match register 3 interrupt service routine */
	else if(LPC_TIM0->IR & 8)
  {
		LPC_TIM3->IR =  8 ;			/* clear interrupt flag */	
	}
 
	return;
}






/******************************************************************************
**                            End Of File
******************************************************************************/
